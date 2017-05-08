"use strict";

var fiscalYear = 2017; // default fiscal year in the selection drop down

/*
Conservation International Color Palette
ARCTIC  #FFFFFF
LEMUR   #757B82
PANTHER #5C5C61
VOLCANO #E6673E
CLOWNFISH   #F67D4B
TIGERLILY   #F79421
ORANGUTAN   #FFAD26
FLOWER  #FFC600
HOME    #FFE912
TREE FROG   #BAD636
MOTHER NATURE   #4CA950
RAINFOREST  #357D57
OCEAN   #1A5EAB
MACAW   #0193D7
SKY #7ECBEF
*/

var rowColors = ['#7ECBEF','#1A5EAB','#4CA950','#FFE912','#BAD636','#F79421','#E6673E','#757B82']; //Sky,Ocean,Mother Nature,Home,Tree Frog,TigerLily,Volcano,Lemur

// dimensions for the charts
var height = 300,
    width = height * 3 / 2;

var barMargin = {
        top: 35,
        right: 0,
        bottom: 145,
        left: 50
    },
    circleMargin = {
        top: 0,
        right: 0,
        bottom: 50,
        left: 50
    };

// tick label and tooltip formats
var sFormat = d3.format("s"),
    dFormat = d3.format("d"),
    currFormat = d3.format("$,.0f");

// tooptip
var tooltip = d3.select("body")
    .append("div")
    .style({
        "position": "absolute",
        "z-index": "10",
        "visibility": "hidden"
    })
    .attr({
        "class": "tooltip introCopy"
    });

// if this JavaScript source file resides on a SharePoint server
// the function will return an endpoint Url pointing to a specified SharePoint list
// if not, the endpoint will point to a json file
function getData() {

    var siteUrl = "";
    var test = "";

    function getJson(url) {
        return $.ajax({
            url: url,
            type: "GET",
            headers: {
                "accept": "application/json;odata=nometadata",
                "content-Type": "application/json;odata=verbose"
            }
        });
    }

    function isSharePoint(test) {

        var url = "",
            endpoint;

        if (!test) {
            var columns = "ID,Project,TotalCommitment,ProgramCommitment,FieldSiteCommitment,Notes,Created,Modified,FiscalYear/Title,FundingStatus/Id,FundingStatus/Title,Donor/Title,Program/Title,DonorType/Title,FieldSite/Title,Duration/Title,Author/Title,Editor/Title";
            var expand = "FiscalYear,FundingStatus,Donor,Program,DonorType,FieldSite,Duration,Author,Editor";
            var top = 500;
            url = siteUrl + "/_api/web/lists/GetByTitle('Grants')/items?$select=" + columns + "&$expand=" + expand + "&$top=" + top;
            endpoint = d3.json(url).header("accept", "application/json;odata=nometadata");

        }
        else {
            url = "../SiteAssets/data/Grants.json";
            endpoint = d3.json(url);
        }

        return endpoint;

    }

    try {
        if (typeof _spPageContextInfo.webServerRelativeUrl !== undefined) {
            UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            siteUrl = _spPageContextInfo.webAbsoluteUrl;
            test = false;
        }
    }
    catch (e) {
        siteUrl = undefined;
        test = true;
    }

    var endpoint = isSharePoint(test);

    // Get the data
    d3_queue.queue()
        .defer(endpoint.get)
        .await(createViz);

}

function createViz(error, data) {

    var dataSet = data.value;

    // set crossfilter
    var ndx = crossfilter(dataSet);

    // define dimensions
    var fiscalYearDim = ndx.dimension(function(d) {
            return +d.FiscalYear.Title;
        }),
        programDim = ndx.dimension(function(d) {
            return d.Program.Title;
        }),
        // programCountDim = ndx.dimension(function(d) { return d.Program.Title; }),
        programAmountDim = ndx.dimension(function(d) {
            return d.Program.Title;
        }),
        programCompDim = ndx.dimension(function(d) {
            return d.Program.Title;
        }),
        statusDim = ndx.dimension(function(d) {
            return d.FundingStatus.Title;
        }),
        commitDim = ndx.dimension(function(d) {
            return d.TotalCommitment;
        }),
        idDim = ndx.dimension(function(d) {
            return d.ID;
        });

    // group dimensions
    var all = ndx.groupAll(),
        commitmentByFieldSite = programCompDim.group().reduceSum(function(d) {
            return d.FieldSiteCommitment;
        }),
        commitmentByProgram = programCompDim.group().reduceSum(function(d) {
            return d.ProgramCommitment;
        }),
        amountByProgram = programAmountDim.group().reduceSum(function(d) {
            return d.TotalCommitment;
        }),
        // commitmentCount = programCountDim.group(),
        corpDonor = programDim.group().reduceSum(function(d) {
            if (d.DonorType.Title == 'Corporate') {
                return d.TotalCommitment;
            }
            else {
                return 0;
            }
        }),
        foundDonor = programDim.group().reduceSum(function(d) {
            if (d.DonorType.Title == 'Foundation') {
                return d.TotalCommitment;
            }
            else {
                return 0;
            }
        }),
        indDonor = programDim.group().reduceSum(function(d) {
            if (d.DonorType.Title == 'Individual') {
                return d.TotalCommitment;
            }
            else {
                return 0;
            }
        }),
        pubDonor = programDim.group().reduceSum(function(d) {
            if (d.DonorType.Title == 'Public') {
                return d.TotalCommitment;
            }
            else {
                return 0;
            }
        }),
        commitmentByStatus = statusDim.group().reduceSum(function(d) {
            return d.TotalCommitment;
        }),
        commitmentByFY = fiscalYearDim.group().reduceSum(function(d) {
            return d.TotalCommitment;
        }),
        netFieldCommitments = ndx.groupAll().reduceSum(function(d) {
            return d.FieldSiteCommitment;
        }),
        netProgramCommitments = ndx.groupAll().reduceSum(function(d) {
            return d.ProgramCommitment;
        }),
        netTotalCommitments = ndx.groupAll().reduceSum(function(d) {
            return d.TotalCommitment;
        });

    var programs = programDim.group().top(Infinity).map(function(d) {
        return d.key;
    });
    
    // dc.js chart types
    var select = dc.selectMenu('#fiscalYear'),
        totalCommitments = dc.numberDisplay("#total-commitments"),
        fieldCommitments = dc.numberDisplay("#field-commitments"),
        programCommitments = dc.numberDisplay("#program-commitments"),
        donorBarChart = dc.barChart("#chart-bar-donor"),
        programRowChart = dc.rowChart('#chart-amount-row'),
        statusRingChart = dc.pieChart('#chart-ring-status'),
        commitBarChart = dc.barChart("#chart-bar-commit"),
        dataCount = dc.dataCount('#data-count'),
        dataTable = dc.dataTable('#data-table');
        
    // menuselect
    select
        .dimension(fiscalYearDim)
        .group(commitmentByFY)
        // .filterDisplayed(function () {
        //     return true;
        // })
        .multiple(false)
        .numberVisible(null)
        // .order(function (a,b) {
        //     return a.key > b.key ? 1 : b.key > a.key ? -1 : 0;
        // })
        .title(function(d) {
            return d.key;
        })
        .promptText('All Years')
        .promptValue(null);

    select.on('pretransition', function(chart) {
        // add styling to select input
        d3.select('#fiscalYear').classed('dc-chart', false);
        chart.select('select').classed('form-control', true);
    });
    
    select.filter(fiscalYear);
    
    // charts
    totalCommitments
        .formatNumber(d3.format("$,.0f"))
        .valueAccessor(function(d) {
            return +d.toFixed();
            
        })
        .group(netTotalCommitments);

    fieldCommitments
        .valueAccessor(function(d) {
            return +d.toFixed();
        })
        .group(netFieldCommitments);

    programCommitments
        .valueAccessor(function(d) {
            return +d.toFixed();
        })
        .group(netProgramCommitments);

    programRowChart
        .width(width * 2.25)
        .height(height)
        .dimension(programAmountDim)
        .group(amountByProgram)
		.ordinalColors(rowColors)
        .label(function(d) {
			return d.key;
		})
		.title(function(d) {
			return d.value;
		})
		.on('pretransition', function(chart) {
			chart.selectAll('text').style({
				'fill': 'black'
			});
		})
		.renderTitle(false)
		.elasticX(true)
		.xAxis().tickFormat(sFormat)
        ;

    statusRingChart
        .height(height)
        .width(height)
        .radius(height / 2)
        .dimension(statusDim)
        .group(commitmentByStatus)
        .legend(dc.legend().x(height / 3).y(height / 3).itemHeight(18).gap(4))
        .ordinalColors(["#737c82", "#0193D7", "#4CA950", "#F67D4B", "#FFC600"])
        .renderLabel(false)
        .renderTitle(false)
        .innerRadius(100);

    donorBarChart
        .width(width * 1.5)
        .height(height * 1.25)
        .dimension(programDim)
        .group(corpDonor, "Corporate")
        .stack(foundDonor, "Foundation")
        .stack(indDonor, "Individual")
        .stack(pubDonor, "Public")
        .x(d3.scale.ordinal().domain(programs))
        .elasticX(false)
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(width / 5).y(0).itemHeight(18).gap(4).horizontal(true).itemWidth(width / 4))
        .ordinalColors(["#7ECBEF", "#0193D7", "#5b5c61", "#1A5EAB"])
        .renderVerticalGridLines(true)
        .renderTitle(false)
        .margins({
            top: barMargin.top,
            right: barMargin.right,
            bottom: barMargin.bottom,
            left: barMargin.left
        })
        .elasticY(true)
        .yAxis().tickFormat(sFormat);

    commitBarChart
        .width(width * 1.55)
        .height(height * 1.25)
        .dimension(programCompDim)
        .group(commitmentByProgram, "Program")
        .stack(commitmentByFieldSite, "Field Site")
        .x(d3.scale.ordinal().domain(programs))
        .elasticX(false)
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(width / 3).y(0).itemHeight(18).gap(4).horizontal(true).itemWidth(width / 3))
        .ordinalColors(["#BAD636", "#357D57"]) // Tree Frog, Rain Forest
        .renderVerticalGridLines(true)
        .renderTitle(false)
        .margins({
            top: barMargin.top,
            right: barMargin.right,
            bottom: barMargin.bottom,
            left: barMargin.left
        })
        .elasticY(true)
        .yAxis().tickFormat(sFormat);

    dataCount
        .dimension(ndx)
        .group(all);

    dataTable
        .dimension(idDim)
        .group(function(d) {
            return d;
        })
        .size(500)
        .columns([{
                label: 'ID',
                format: function(d) {
                    return d.ID;
                }
            },{
                label: 'Fiscal Year',
                format: function(d) {
                    return d.FiscalYear.Title;
                }
            }, {
                label: 'Funding Status',
                format: function(d) {
                    return d.FundingStatus.Title;
                }
            }, {
                label: 'Program',
                format: function(d) {
                    return d.Program.Title;
                }
            }, {
                label: 'Project',
                format: function(d) {
                    return "<a href='#' data-toggle='modal' data-target='#grantsModal'>" + d.Project + "</a>";
                }
            }, {
                label: 'Donor',
                format: function(d) {
                    return d.Donor.Title;
                }
            }, {
                label: 'Budget to Program',
                format: function(d) {
                    return currFormat(d.ProgramCommitment);
                }
            }, {
                label: 'Budget to Field Site',
                format: function(d) {
                    return currFormat(d.FieldSiteCommitment);
                }
            }, {
                label: 'Total Commitment',
                format: function(d) {
                    return currFormat(d.TotalCommitment);
                }
            }, {
                label: 'Notes',
                format: function(d) {
                    return d.Notes;
                }
            }, {
                label: 'Donor Type',
                format: function(d) {
                    return d.DonorType.Title;
                }
            }, {
                label: 'Duration',
                format: function(d) {
                    var duration;
                    if (d.Duration == undefined) {
                        duration = 'N/A';
                    } else {
                        duration = d.Duration.Title;
                    }
                    
                    return duration;
                }
            }, {
                label: 'Submitted By',
                format: function(d) {
                    return d.Author.Title;
                }
            }, {
                label: 'Date Submitted',
                format: function(d) {
                    return moment(d.Created).format('LL');
                }
            }, {
                label: 'Modified By',
                format: function(d) {
                    return d.Editor.Title;
                }
            }, {
                label: 'Date Last Modified',
                format: function(d) {
                    return moment(d.Modified).format('LL');
                }
            }
        ])
        .on('renderlet', function() {
            dataTable.select('tr.dc-table-group').remove(); // remove unneccesary row dc.js adds beneath the header)
            dataTable.selectAll('.dc-table-column._6').style('text-align', 'right');
            dataTable.selectAll('.dc-table-column._7').style('text-align', 'right');
            dataTable.selectAll('.dc-table-column._8').style('text-align', 'right');
			dataTable.selectAll('a').on('click', function() {
				var cells = d3.select(this.parentNode.parentNode).selectAll('td')[0].map(function(d) {
					var text;
					if (d.firstChild != undefined && d.firstChild.textContent != undefined) {
						text = d.firstChild.textContent;
					}
					else {
						text = d.textContent;
					}
					return text;
				});
				var headers = dataTable.selectAll('thead th')[0].map(function(d) {
					return d.textContent;
				});
				var data = headers.map(function(d, i) {
					var obj = {};
					obj.key = d;
					obj.value = cells[i];
					return obj;
				});

				// debugger;
				$('#grantsModal .modal-body table').remove();
				var table = d3.select('#grantsModal .modal-body').append('table').attr({
					'id':'modal-table', 'class': 'table table-bordered'
				});
				var tbody = table.append('tbody');

				var rows = tbody.selectAll('tr')
					.data(data);

				rows.enter()
					.append('tr');

				rows.exit().remove();

				rows.append('td').text(function(d) {
					return d.key;
				});
				rows.append('td').text(function(d) {
					return d.value;
				});

			});
            

        });

    dc.renderAll();

    // Change the date header to reflect the date and time of the data
    d3.select('#dateHeader').text(' Data as of ' + moment().format('LLL'));

    d3.select('.number-display').classed('top-line', true);

    // format bar charts' x-axis and rotate labels 45 degrees
    d3.selectAll('#chart-bar-donor g.x.axis text').attr({
        "transform": "rotate(45)",
        "y": 9,
        "x": 0,
        "dy": ".35em",
        "class": "text-uppercase"
    }).style({
        "text-anchor": "start"
    });
    d3.selectAll('#chart-bar-commit g.x.axis text').attr({
        "transform": "rotate(45)",
        "y": 9,
        "x": 0,
        "dy": ".35em",
        "class": "text-uppercase"
    }).style({
        "text-anchor": "start"
    });

    // define mouseover and mouseout events
    d3.selectAll("#chart-bar-donor g rect").on("mouseover", showDonorDetail).on("mouseout", hideDetail);
    d3.selectAll("#chart-bar-commit g rect").on("mouseover", showCommitDetail).on("mouseout", hideDetail);
    // d3.selectAll('#chart-count-commit g [class^=row]').on("mouseover", showCountDetail).on("mouseout", hideDetail); // using jQuery Starts With Selector [name^=”value”] also works with D3; http://api.jquery.com/attribute-starts-with-selector/
    d3.selectAll('#chart-amount-row g rect').on("mouseover", showRowDetail).on("mouseout", hideDetail);
    d3.selectAll("#chart-ring-status g path").on("mouseover", showRingDetail).on("mouseout", hideDetail);

    // d3.select('#data-table').insert('input',":first-child").attr({'id':'btnGrants','class':'btn btn-primary btn-sm','type':'button','value':'Export Grants Table','onclick': 'window.location.href="https://conservation.sharepoint.com/teams/units/mcso/fundraising-dashboard/Library/Grants.xlsx"'}).style({'text-align':'left'});
    d3.select('#data-table').insert('input', ":first-child").attr({
        'id': 'btnGrants',
        'class': 'btn btn-primary btn-sm',
        'type': 'button',
        'value': 'Export to Excel',
        'onclick': 'exportTable()'
    }).style({
        'text-align': 'left'
    });

	//d3.select('#emailModal .modal-body button').on("click",sendMail());

    // Show tooltip on hover
    function showRingDetail() {

        // show tooltip with information from the __data__ property of the element
        var d = this.__data__;
        var status = d.data.key;
        var amount = d.data.value;

        var content = "<b>Status: </b>" + status + "<br/>" +
            "<b>Amount: </b>" + currFormat(amount) + "<br/>";

        return tooltip.style({
                "visibility": "visible",
                "top": (event.pageY - 10) + "px",
                "left": (event.pageX - 385) + "px"
            })
            .html(content);
    }

    // Show tooltip on hover
    function showDonorDetail() {

        // show tooltip with information from the __data__ property of the element
        var d = this.__data__;
        var donorType = d.layer;
        var amount = d.data.value;
        var program = d.data.key;

        var content = "<b>Program: </b>" + program + "<br/>" +
            "<b>Donor Type: </b>" + donorType + "<br/>" +
            "<b>Amount: </b>" + currFormat(amount) + "<br/>";

        return tooltip.style({
                "visibility": "visible",
                "top": (event.pageY - 10) + "px",
                "left": (event.pageX + 10) + "px"
            })
            .html(content);
    }

    // Show tooltip on hover
    function showCommitDetail() {

        // show tooltip with information from the __data__ property of the element
        var d = this.__data__;
        var comp = d.layer;
        var amount = d.data.value;
        var program = d.data.key;

        var content = "<b>Program: </b>" + program + "<br/>" +
            "<b>Who It Goes To: </b>" + comp + "<br/>" +
            "<b>Amount: </b>" + currFormat(amount) + "<br/>";

        return tooltip.style({
                "visibility": "visible",
                "top": (event.pageY - 10) + "px",
                "left": (event.pageX - 385) + "px"
            })
            .html(content);
    }

    // Show tooltip on hover
    function showRowDetail() {

        // show tooltip with information from the __data__ property of the element
        var d = this.__data__;
        var program = d.key;
        var amount = d.value;
        
        var content = "<b>Program: </b>" + program + "<br/>" +
            "<b>Amount: </b>" + currFormat(amount) + "<br/>";

        return tooltip.style({
                "visibility": "visible",
                "top": (event.pageY - 10) + "px",
                "left": (event.pageX + 10) + "px"
            })
            .html(content);
    }

    // Hide tooltip on hover
    function hideDetail() {

        // hide tooltip
        return tooltip.style("visibility", "hidden");
    }

}

function exportTable() {
    export_table_to_excel('data-table', 'Grants');
} // parameters: 0, id of html table, 1, name of workbook

function toggleComposition() {
    var emailNode = $('#emailComposition');
    
    if (emailNode.hasClass('hidden')) {
        emailNode.removeClass('hidden');
    } else {
        emailNode.addClass('hidden');
    }
}

function sendMail() {
    
	var greeting = $('#emailText')[0].value;
	var tableData = d3.selectAll("#grantsModal .modal-body table tbody tr").data();
	var details = d3.selectAll("#grantsModal .modal-body table tbody tr td:first-child")[0];
	// change this to reference one of the get user functions above
	var from = SP.ClientContext.get_current().get_web().get_currentUser().get_title();
	var grantId = details[0].__data__.value;
	var to = details[12].__data__.value;
	processSendEmails(from, to, greeting, grantId, tableData);
}

function processSendEmails(from, to, greeting, grantId, tableData) {

	var body = '<p>' + greeting + '</p><br/>' + '<table style="border: 1px solid #ddd;margin-bottom:20px;border-spacing:0;border-collapse:collapse;background-color:transparent;"><tbody style="box-sizing: border-box;display:table-row-group;vertical-align: middle;border-color:inherit">';
	
	tableData.forEach(function(d) {
		body += '<tr style="box-sizing: border-box">';
		body += '<td style="color:#fff;background-color:#0193d7;font-weight:900;color:#fff;background-color:#0193d7;border: 1px solid #ddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">' + d.key + '</td>';
		body += '<td style="border: 1px solid #ddd;padding: 8px;line-height: 1.4285714;vertical-align: top;">' + d.value + '</td></tr>';
	});
	
	body += '</tbody></table>';
	
    var subject = 'Fundraising Dashboard Commitment #' + grantId;

    // Call sendEmail function
    //
    sendEmail(from, to, body, subject);
}

function sendEmail(from, to, body, subject) {
    //Get the relative url of the site
    var siteurl = _spPageContextInfo.webServerRelativeUrl;
    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': {
                    'type': 'SP.Utilities.EmailProperties'
                },
                'From': from,
                'To': {
                    'results': [to]
                },
                'Body': body,
                'Subject': subject
            }
        }),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
        },
        success: function(data) {
            alert('Email Sent Successfully');
        },
        error: function(err) {
            alert('Error in sending Email: ' + JSON.stringify(err));
        }
    });
}

// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId) {
    
    // from https://msdn.microsoft.com/en-us/library/jj713593(v=office.15).aspx#code-snippet-2

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = true;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '280px';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}

// Query the picker for user information.
function getUserInfo() {

    // Get the people picker object from the page.
    var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

    // Get information about all users.
    var users = peoplePicker.GetAllUserInfo();
    var userInfo = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        for (var userProperty in user) { 
            userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
        }
    }
    $('#resolvedUsers').html(userInfo);

    // Get user keys.
    var keys = peoplePicker.GetAllUserKeys();
    $('#userKeys').html(keys);

    // Get the first user's ID by using the login name.
    getUserId(users[0].Key);
}

// Get the user ID.
function getUserId(loginName) {
    var context = new SP.ClientContext.get_current();
    this.user = context.get_web().ensureUser(loginName);
    context.load(this.user);
    context.executeQueryAsync(
         Function.createDelegate(null, ensureUserSuccess), 
         Function.createDelegate(null, onFail)
    );
}

function ensureUserSuccess() {
    $('#userId').html(this.user.get_id());
}

function onFail(sender, args) {
    alert('Query failed. Error: ' + args.get_message());
}    

$(document).ready(function() {
    getData();
});
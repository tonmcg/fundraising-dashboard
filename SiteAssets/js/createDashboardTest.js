"use strict";

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

var ndx;
var fiscalYearDim,
    programDim,
    programAmountDim,
    programCompDim,
    statusDim,
    commitDim,
    idDim;

var fiscalYear = 2017; // default fiscal year in the selection drop down

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
    
// dc.js chart types
var totalCommitments = dc.numberDisplay("#total-commitments"),
    fieldCommitments = dc.numberDisplay("#field-commitments"),
    programCommitments = dc.numberDisplay("#program-commitments"),
    donorBarChart = dc.barChart("#chart-bar-donor"),
    programRowChart = dc.rowChart('#chart-amount-row'),
    statusRingChart = dc.pieChart('#chart-ring-status'),
    commitBarChart = dc.barChart("#chart-bar-commit"),
    dataCount = dc.dataCount('#data-count'),
    dataTable = dc.dataTable('#data-table');
   	 
function callData() {
    // if this JavaScript source file resides on a SharePoint server
    // the function will return an endpoint Url pointing to a specified SharePoint list
    // if not, the endpoint will point to a json file    

    var siteUrl = "";
    var test = "";

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
    
    return endpoint;

}

function createViz(error, data) {

    var dataSet = data.value;

    // set crossfilter
    ndx = crossfilter(dataSet);

    // define dimensions
	fiscalYearDim = ndx.dimension(function(d) {
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
        netFieldCommitments = ndx.groupAll().reduceSum(function(d) {
            return d.FieldSiteCommitment;
        }),
        netProgramCommitments = ndx.groupAll().reduceSum(function(d) {
            return d.ProgramCommitment;
        }),
        netTotalCommitments = ndx.groupAll().reduceSum(function(d) {
            return d.TotalCommitment;
        });

    var fiscalYears = fiscalYearDim.group().top(Infinity).map(function(d) {
        return d.key;
    }).sort(function(a, b) {
        return a - b;
    });

    var programs = programDim.group().top(Infinity).map(function(d) {
        return d.key;
    });
    
    // drop down selection
    var selector = d3.select("#fiscalYears");

    // append option values to fiscal year select input
    selector.selectAll("option")
        .data(fiscalYears)
        .enter()
        .append("option")
        .attr("value", function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });

    // set default fiscal year
    // define on change event
    selector.property("value", fiscalYear).on("change", function() {
        fiscalYearDim.filter(this.value);
        dc.redrawAll();
    });
    
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
				'fill': 'black',
				'font-size': '16px'
			});
		})
		.renderTitle(false)
		.elasticX(true)
		.xAxis().tickFormat(sFormat);
		
    programRowChart.on('renderlet',function(chart) {
        chart.selectAll('g rect').on("mouseover", showRowDetail).on("mouseout", hideDetail);
    });

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
        
    statusRingChart.on('renderlet',function(chart) {
        chart.selectAll("g path").on("mouseover", showRingDetail).on("mouseout", hideDetail);
    });

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
        .yAxis().tickFormat(sFormat)
        ;
        
    donorBarChart.on('renderlet',function(chart){
        chart.selectAll("g rect").on("mouseover", showDonorDetail).on("mouseout", hideDetail);            
    });

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
        
    commitBarChart.on('renderlet',function(chart) {
        chart.selectAll("g rect").on("mouseover", showCommitDetail).on("mouseout", hideDetail);
    });

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
                    if (d.Duration === undefined) {
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
            dataTable.selectAll('.dc-table-column._2').attr('class', 'editable'); // only for Ashleigh McGovern
            dataTable.selectAll('.dc-table-column._6').style('text-align', 'right');
            dataTable.selectAll('.dc-table-column._7').style('text-align', 'right');
            dataTable.selectAll('.dc-table-column._8').style('text-align', 'right');
            // define table events
            // add selected item information as table in modal
            $('#data-table').on('click', 'tbody tr a', function(event) {
                var thisTable = d3.select($(this).closest('table')[0]);
                var cells = thisTable.selectAll('td')[0].map(function(d) {
                	var text;
                	if (d.firstChild != undefined && d.firstChild.textContent != undefined) {
                		text = d.firstChild.textContent;
                	}
                	else {
                		text = d.textContent;
                	}
                	return text;
                });
                var headers = thisTable.selectAll('thead th')[0].map(function(d) {
                	return d.textContent;
                });
                var data = headers.map(function(d, i) {
                	var obj = {};
                	obj.key = d;
                	obj.value = cells[i];
                	return obj;
                });
                
                $('#tableDiv table').remove();
                var table = d3.select('#tableDiv').append('table').attr({
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
            
            $('#data-table .editable').click(function (e) {
                e.stopPropagation();
                var value = $(this).html();
                var optVals = getOptionVals(value);
                updateVal(this, optVals,value);
            });
            
        });

    fiscalYearDim.filter(fiscalYear);
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

}

function getOptionVals(value) {
	var val;
	switch (value) {
		case "Development":
			val = '1';
			break;
		case "Submitted":
			val = '2';
			break;
		case "Approved":
			val = '3';
			break;
		case "Booked":
			val = '4';
			break;
		case "Rejected":
			val = '5';
			break;
	}
    var html = '<select type="text" id="editableStatus" class="thVal"><option value="' + val + '">' + value + '</option>';
    var statuses = [{key: 1, value:'Development'},{key: 2,value:'Submitted'},{key:3,value:'Approved'},{key:4,value:'Booked'},{key:5,value:'Rejected'}]; // replace this with data from status ring legend __data__
    statuses.forEach(function(d) {
        if (d.value != value) {
            html += '<option value="' + d.key + '">' + d.value + '</option>';
        }
    });
    html+='</select>';
    return html;
}

// update selected value in data table
// http://jsfiddle.net/8acoz3fv/4/
function updateVal(currentEle, optVals, value) {
    $(currentEle).html(optVals);
    // $(currentEle).children('select').children('option:selected').text = value
    $(".thVal", currentEle).click(function(e) {
        e.stopPropagation();
    });

    $(document).click(function() {
        $(".thVal").replaceWith(function() {
            var id = parseInt($(this).closest('tr').children('td:first').text());
            var newFundStatusVal = parseInt($(this).children('option:selected').val());
            var newFundStatusText = $(this).children('option:selected').text();

            //  POST procedure to update value on server here
            updateStatus(id, newFundStatusVal);
            return newFundStatusText;
        });
    });
}

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

function exportTable() {
    export_table_to_excel('data-table', 'Grants');
} // parameters: 0, id of html table, 1, name of workbook

// define glyph click events
function toggleComposition() {
	if ($("#emailComposition" ).is(":hidden") ) {
		$("#emailComposition" ).slideDown("slow");
	} else {
		$("#emailComposition" ).slideUp("slow");
	}

}

// define email modal hide events
$('#grantsModal').on('hidden.bs.modal', function (e) {
	// clear out text inputs and resolved peoplepicker names after modal hide
	$('#emailRecipient_TopSpan_ResolvedList a').trigger('click'); // let SP do the work of removing the resolved names in the people picker field
	$('#emailRecipient_TopSpan_HiddenInput').val(""); // need to also clear out the text in the recipient input tag
	$('#emailSubject').val(""); // clear out text in subject input tag
	$('#emailText').val(""); // clear out text in message body textarea tag
	// hide #emailComposition div when modal is hidden
	$('#emailComposition').css('display','none'); // hide the email composition area; back to default setting
	
});

// define email modal hide events
$('#updateSuccessModal').on('hidden.bs.modal', function (e) {
	// reload page
	location.reload();
});

function sendMail() {
    
	var from = SP.ClientContext.get_current().get_web().get_currentUser().get_title();
	var to = getUserInfo();
	var subject = $('#emailSubject')[0].value;
	var greeting = $('#emailText')[0].value;
	var tableData = d3.selectAll("#grantsModal .modal-body table tbody tr").data();
	processSendEmails(from, to, subject, greeting, tableData);
}

function processSendEmails(from, to, subject, greeting, tableData) {

	var body = '<p>' + greeting.replace( /\n/g, '<br \\>' ) + '</p><br/>' + '<table style="border: 1px solid #ddd;margin-bottom:20px;border-spacing:0;border-collapse:collapse;background-color:transparent;"><tbody style="box-sizing: border-box;display:table-row-group;vertical-align: middle;border-color:inherit">';
	
	tableData.forEach(function(d) {
		body += '<tr style="box-sizing: border-box">';
		body += '<td style="color:#fff;background-color:#0193d7;font-weight:900;color:#fff;background-color:#0193d7;border: 1px solid #ddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">' + d.key + '</td>';
		body += '<td style="border: 1px solid #ddd;padding: 8px;line-height: 1.4285714;vertical-align: top;">' + d.value + '</td></tr>';
	});
	
	body += '</tbody></table>';
	
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
                'CC': {
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
            $('#emailSuccessModal').modal('show');
            
        },
        error: function(err) {
        	console.log('There was an error: ' + JSON.stringify(err));
            alert('There was an error sending your email. Please contact Ashleigh McGovern at amcgovern@conservation.org for assistance.');
        }
    });
}

// Render and initialize the client-side People Picker.
function initializePeoplePicker(peoplePickerElementId) {
    
    // from https://msdn.microsoft.com/en-us/library/jj713593(v=office.15).aspx#code-snippet-2

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema.PrincipalAccountType = 'User,DL,SecGroup,SPGroup';
    schema.SearchPrincipalSource = 15;
    schema.ResolvePrincipalSource = 15;
    schema.AllowMultipleValues = false;
    schema.MaximumEntitySuggestions = 50;
    //schema['Width'] = '280px';

    // Render and initialize the picker. 
    // Pass the ID of the DOM element that contains the picker, an array of initial
    // PickerEntity objects to set the picker value, and a schema that defines
    // picker properties.
    SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);    // removed 'this' object from statement
    
    // add form-control class to people picker input for Bootstrap styling purposes
    $('#emailRecipient_TopSpan').addClass('form-control');
}

// Query the picker for user information.
function getUserInfo() {

    // Get the people picker object from the page.
    var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.emailRecipient_TopSpan;    // removed 'this' object from statement

    // Get information about all users.
    var users = peoplePicker.GetAllUserInfo();
    var userEmails = '';
    for (var i=0; i < users.length;i++) {
    	userEmails += users[i].Description + ';';
    }

    // Return the users
    return users[0].Description;
}

function resetData(ndx,dimensions) {

	var totalCommitmentsFilter = totalCommitments.filters(),
	fieldCommitmentsFilters = fieldCommitments.filters(),
	programCommitmentsFilters = programCommitments.filters(),
	donorBarChartFilters = donorBarChart.filters(),
	programRowChartFilters = programRowChart.filters(),
	statusRingChartFilters = statusRingChart.filters(),
	commitBarChartFilters = commitBarChart.filters(),
	dataCountFilters = dataCount.filters(),
	dataTableFilters = dataTable.filters();

	totalCommitments.filter(null);
	fieldCommitments.filter(null);
	programCommitments.filter(null);
	donorBarChart.filter(null);
	programRowChart.filter(null);
	statusRingChart.filter(null);
	commitBarChart.filter(null);
	dataCount.filter(null);
	dataTable.filter(null);
	
	fiscalYearDim.filter(fiscalYear);

    ndx.remove();

	totalCommitments.filter([totalCommitmentsFilter]);
	fieldCommitments.filter([fieldCommitmentsFilters]);
	programCommitments.filter([programCommitmentsFilters]);
	donorBarChart.filter([donorBarChartFilters]);
	programRowChart.filter([programRowChartFilters]);
	statusRingChart.filter([statusRingChartFilters]);
	commitBarChart.filter([commitBarChartFilters]);
	dataCount.filter([dataCountFilters]);
	dataTable.filter([dataTableFilters]);
}

function updateStatus(id, fundStatus) {
    UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('Grants')/items(" + id + ")",
        type: 'POST',
        contentType: "application/json;odata=verbose",
        data: JSON.stringify({
            '__metadata': { 'type': 'SP.Data.GrantsListItem' },
            'FundingStatusId': fundStatus
        }),
        headers: {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose; charset=utf-8',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            "IF-MATCH": "*",
            "X-Http-Method": "PATCH"
        },
        success: function() {
	        $('#updateSuccessModal').modal('show');
	        // get the data and reset the crossfilter without having to reload the page
	        // http://jsfiddle.net/pm12xf3z/
		    // Get the data
// 		    function updateData(error,dataUpdate) {
// 		        resetData(ndx, [fiscalYearDim, programDim, programAmountDim, programCompDim, statusDim, commitDim, idDim]);
// 		        ndx.add(dataUpdate);
// 		        dc.redrawAll();
// 		    }
// 			d3_queue.queue().defer(callData().get).await(updateData);
        },
        error: function(error) {
	        alert(JSON.stringify(error));
        }
    });
	
}

function getData() {
    // Get the data
    d3_queue.queue()
        .defer(callData().get)
        .await(createViz);
}

$(document).ready(function() {
    getData();
    initializePeoplePicker('emailRecipient');
});
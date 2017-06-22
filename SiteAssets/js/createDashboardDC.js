"use strict";

let fiscalYear = 2017; // default fiscal year in the selection drop down

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

let rowColors = ['#7ECBEF','#1A5EAB','#4CA950','#FFE912','#BAD636','#F79421','#E6673E','#757B82']; //Sky,Ocean,Mother Nature,Home,Tree Frog,TigerLily,Volcano,Lemur

// define data
const columns = [{
    "label": "ID",
    "field": "ID",
    "format": function(d) {
        return d.ID;
    },
    "type": "integer",
    "display": false,
    "sort": false
}, {
    "label": "Modified By",
    "field": "Editor.Title",
    "format": function(d) {
        return d.Editor.Title;
    },
    "type": "string",
    "display": false,
    "sort": false
}, {
    "label": "Created By",
    "field": "Author.Title",
    "format": function(d) {
        return d.Author.Title;
    },
    "type": "string",
    "display": false,
    "sort": false
}, {
    "label": "Notes",
    "field": "Notes",
    "format": function(d) {
        return d.Notes;
    },
    "type": "string",
    "display": false,
    "sort": false
}, {
    "label": "Year",
    "field": "FiscalYear/Title",
    "format": function(d) {
        return d.FiscalYear.Title;
    },
    "type": "string",
    "display": true,
    "sort": true
}, {
    "label": "Program",
    "field": "Program/Title",
    "format": function(d) {
        return "<a href=# onclick=document.getElementById(&#39;grantsModal&#39;).style.display=&#39;block&#39;>" + d.Program.Title + "</a>";
    },
    "type": "string",
    "display": true,
    "sort": true
}, {
    "label": "Donor",
    "field": "Donor/Title",
    "format": function(d) {
        return d.Donor.Title;
    },
    "type": "string",
    "display": true,
    "sort": true
}, {
    "label": "Project",
    "field": "Project",
    "format": function(d) {
        return d.Project;
    },
    "type": "string",
    "display": true,
    "sort": true
}, {
    "label": "Funding Status",
    "field": "FundingStatus/Title",
    "format": function(d) {
        return d.FundingStatus.Title;
    },
    "type": "string",
    "display": true,
    "sort": true
}, {
    "label": "Donor Type",
    "field": "DonorType/Title",
    "format": function(d) {
        return d.DonorType.Title;
    },
    "type": "string",
    "display": true,
    "sort": true
}, {
    "label": "Program Total",
    "field": "ProgramCommitment",
    "format": function(d) {
        return currFormat(+d.ProgramCommitment);
    },
    "type": "double",
    "display": true,
    "sort": true
}, {
    "label": "Field Site Total",
    "field": "FieldSiteCommitment",
    "format": function(d) {
        return currFormat(+d.FieldSiteCommitment);
    },
    "type": "double",
    "display": true,
    "sort": true
}, {
    "label": "Total",
    "field": "TotalCommitment",
    "format": function(d) {
        return currFormat(+d.TotalCommitment);
    },
    "type": "double",
    "display": true,
    "sort": true
}];

// create spinner
let target = d3.select("#dashboard").node();
// create tooltip
let tooltip = d3.select("body").append("div").style({"position": "absolute","z-index": "10","visibility": "hidden"}).attr({"class": "tooltip"});
// trigger loader
let spinner = new Spinner(opts).spin(target);

// if this JavaScript source file resides on a SharePoint server
// the function will return an endpoint Url pointing to a specified SharePoint list
// if not, the endpoint will point to a json file
function getData() {

    let test = '';
    let siteUrl = '';
    let cols = [];
    let expand = '';
    let filter = '';
    let top = '';

    // test if on SharePoint
    try {
        if (typeof _spPageContextInfo !== undefined) {
            siteUrl = _spPageContextInfo.webAbsoluteUrl;
            test = false;
        }
    }
    catch (e) {
        siteUrl = undefined;
        test = true;
    }

    function callData(siteUrl, type, title, fields, expand, filter, top) {

        let url = "",
            endpoint;

        if (!test) {
        	if (type !== 'web') {
            	url = siteUrl + "/_api/web/lists/GetByTitle('" + title + "')/items?$select=" + fields + "&$expand=" + expand + "&$filter=" + filter + "&$top=" + top;
        	} else {
        		url = siteUrl + "/_api/web/" + title;
        	}
            endpoint = d3.json(url).header("accept", "application/json;odata=nometadata");

        }
        else {
            url = "../SiteAssets/data/" + title + ".json";
            endpoint = d3.json(url);
        }

        return endpoint;

    }

    for (let i = 0;i<columns.length;i++) {
        cols.push(columns[i].field);
    }
    expand = "FiscalYear,FundingStatus,FieldSite,Donor,DonorType,Author,Editor,Duration";
    filter = "";
    top = 3000;

    let componentEndpoint = callData(siteUrl, 'list','Grants', cols.toString(), expand, filter, top);

    // Get the data
    componentEndpoint.get(function(error, data) {
        createViz(error, data);
    });

}

function createViz(error, data) {

    if (error) throw error;
    
    // stop spin.js loader
    spinner.stop();
    
    // dimensions for the charts
    const dashboardHeight = getSize().height;
    const headerHeight = document.querySelector('div.w3-main > header').offsetHeight;
    const footerHeight = document.querySelector('div.w3-main > footer').offsetHeight;
    
    const ringChartHeaderHeight = document.querySelector('#ringChart header').offsetHeight;
    const ringChartFooterHeight = document.querySelector('#ringChart footer').offsetHeight;
    const ringChartHeight = (dashboardHeight - headerHeight - footerHeight - ringChartHeaderHeight - ringChartFooterHeight) * 1 / 2;
    
    const rowChartHeaderHeight = document.querySelector('#rowChart header').offsetHeight;
    const rowChartFooterHeight = document.querySelector('#rowChart footer').offsetHeight;
    const rowChartHeight = (dashboardHeight - headerHeight - footerHeight - rowChartHeaderHeight - rowChartFooterHeight) * 1 / 2;
    
    const tableHeaderHeight = document.querySelector('#tableChart header').offsetHeight;
    const tableFooterHeight = document.querySelector('#tableChart footer').offsetHeight;
    const tableHeight = (dashboardHeight - headerHeight - footerHeight - tableHeaderHeight - tableFooterHeight) * 1 / 3 * 0.85;
    
    const tableWidth = document.querySelector('#tableChart footer').clientWidth; // does not include margin, padding, or scroll bar widths
    
    const ringChartWidth = document.querySelector('#ringChart footer').clientWidth; // does not include margin, padding, or scroll bar widths
    const rowChartWidth = document.querySelector('#rowChart footer').clientWidth; // does not include margin, padding, or scroll bar widths

    const margins = {
        top: 25,
        right: 10,
        bottom: 20,
        left: 10
    };
    
    // data preparation
    let dataSet = data.value;

    // set crossfilter
    let ndx = crossfilter(dataSet);

    // define dimensions
    let fiscalYearDim = ndx.dimension(function(d) {
            return +d.FiscalYear.Title;
        }),
        programAmountDim = ndx.dimension(function(d) {
            return d.Program.Title;
        }),
        statusDim = ndx.dimension(function(d) {
            return d.FundingStatus.Title;
        }),
        tableDim = ndx.dimension(function(d) {
            return d.ID;
        });

    // group dimensions
    let all = ndx.groupAll(),
        amountByProgram = programAmountDim.group().reduce(
            function(p, v) {
                ++p.count;
                p.amount += Math.round(v.TotalCommitment);
                return p;
            },
            function(p, v) {
                --p.count;
                p.amount -= Math.round(v.TotalCommitment);
                return p;
            },
            function() {
                return {
                    count: 0,
                    amount: 0
                };
            }
        ),
        commitmentByStatus = statusDim.group().reduce(
            function(p, v) {
                ++p.count;
                p.amount += Math.round(v.TotalCommitment);
                return p;
            },
            function(p, v) {
                --p.count;
                p.amount -= Math.round(v.TotalCommitment);
                return p;
            },
            function() {
                return {
                    count: 0,
                    amount: 0
                };
            }
        ),
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
        }),
        totalAmount = ndx.groupAll().reduceSum(function(d) {
            return Math.round(d.TotalCommitment);
        });        

    // dc.js chart types
    let select = dc.selectMenu('#fiscalYear'),
        totalCommitments = dc.numberDisplay("#total-commitments"),
        fieldCommitments = dc.numberDisplay("#field-commitments"),
        programCommitments = dc.numberDisplay("#program-commitments"),
        programRowChart = dc.rowChart('#chart-amount-row'),
        statusRingChart = dc.pieChart('#chart-ring-status'),
        dataCount = dc.dataCount('#data-count'),
        dataTable = dc.dataTable('#data-table')
        ;
        
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
        chart.select('select').classed('form-control', true).style("margin-top","15px");
    });
    
    select.filter(fiscalYear);
    
    // charts
    totalCommitments
        // .formatNumber(d3.format("$,.0f"))
        .valueAccessor(function(d) {
            return formatNumber(+d.toFixed());
            
        })
        .group(netTotalCommitments);

    fieldCommitments
        .valueAccessor(function(d) {
            return formatNumber(+d.toFixed());
        })
        .group(netFieldCommitments);

    programCommitments
        .valueAccessor(function(d) {
            return formatNumber(+d.toFixed());
        })
        .group(netProgramCommitments);

    programRowChart
        .width(rowChartWidth)
        .height(rowChartHeight)
        .dimension(programAmountDim)
        .group(amountByProgram)
        .valueAccessor(function(d) {
            return d.value.amount;
        })
		.ordinalColors(rowColors)
        .label(function(d) {
            if (programRowChart.hasFilter() && !programRowChart.hasFilter(d.key)) {
                return d.key + ' (0%)';
            }
            let label = d.key;
            if (all.value()) {
                // label += ' (' + Math.round(d.value.amount / totalAmount.value() * 100) + '%)';
                d.value.percent = d.value.amount / totalAmount.value();
                label += ' (' + perFormat(d.value.percent) + ')';
            }
            return label;
        })
		.title(function(d) {
			return d.value.amount;
		})
        .othersGrouper(false)
        .ordering(function(d) {
            return -d.value.amount;
        })
        .on('pretransition', function(chart) {
            setResponsiveSVG(chart);
            chart.selectAll('g.row text').style({
                'fill': function(d) {
                    let fill = '';
                    d.value.amount !== 0 ? fill = 'black' : fill = 'none';
                    return fill;
                }
            });
        })
		.renderTitle(false)
		.elasticX(true)
		.xAxis().tickFormat(sFormat)
        ;
        
    statusRingChart
        .height(ringChartHeight)
        .width(ringChartWidth)
        .radius(d3.min([ringChartWidth, ringChartHeight]) / 2)
        .dimension(statusDim)
        .group(commitmentByStatus)
        .valueAccessor(function(d) {
            return d.value.amount;
        })
        .legend(dc.legend().y(0))
        .ordinalColors(["#737c82", "#0193D7", "#4CA950", "#F67D4B", "#FFC600"])
        .label(function(d) {
            if (statusRingChart.hasFilter() && !statusRingChart.hasFilter(d.key)) {
                return '0%';
            }
            let label = '';
            if (all.value()) {
                // label += ' (' + Math.round(d.value.amount / totalAmount.value() * 100) + '%)';
                d.value.percent = d.value.amount / totalAmount.value();
                label += perFormat(d.value.percent);
            }
            return label;
        })
        .renderTitle(false)
        .renderTitle(false)
        .innerRadius(d3.min([ringChartWidth, ringChartHeight]) / 4);

    statusRingChart.on('pretransition', function(chart) {
        setResponsiveSVG(chart);
    });
        

    dataCount
        .dimension(ndx)
        .group(all);

    let sortColumn = 0;
    let displayCols = 0;
    let numericCol = 0;
    let tableHTML = '<thead><tr>';
    for (let i = 0; i < columns.length; i++) {
        let display = '';
        let classed = '';
        if (columns[i].type =="double" && !numericCol > 0) {
            numericCol = i+1;
        }
        if (!columns[i].display) {
            displayCols++;
            display = 'display:none;';
        }
        if (columns[i].sort) {
            sortColumn = i;
            classed = 'sorting_asc';
        }
        else {
            classed = 'sorting';
        }

        tableHTML += "<th class='" + classed + "' rowspan='1' colspan='1' style='" + display + "' data-col='" + columns[i].field + "'>" + columns[i].label + "</th>";
    }

    tableHTML += "</tr></thead>";

    $('.dc-data-tables_scrollHeadInner > table').append(tableHTML);

    dataTable
        .width(tableWidth)
        .height(tableHeight)
        .dimension(tableDim)
        .group(function(d) {
            return d;
        })
        .showGroups(false)
        .size(Infinity)
        .columns(columns)
        .sortBy(function(d) {
            return d[columns[0].field];
        })
        .order(d3.ascending)
        .on('renderlet', function() {
            $('th:nth-child(-n+'+displayCols+')').not('th:nth-child(' + sortColumn + ')').css('display', 'none'); // hide header column; assumes columns array groups invisible columns together
            $('td:nth-child(-n+'+displayCols+')').not('th:nth-child(' + sortColumn + ')').css('display', 'none'); // hide header column; assumes columns array groups invisible columns together
            $('td:nth-child(n+'+numericCol+')').css('text-align', 'right'); // right align numerical data; assumes columns array groups double data type columns together
            /**
             * Adapted from Datatables jquery.dataTables.js:5169-5436
             * Update the header, footer and body tables for resizing - i.e. column
             * alignment.
             *
             * Welcome to the most horrible function DataTables. The process that this
             * function follows is basically:
             *   1. Re-create the table inside the scrolling div
             *   2. Take live measurements from the DOM
             *   3. Apply the measurements to align the columns
             *   4. Clean up            
             */
            function _fnScrollDraw() {

                /**
                 * Get an array of column indexes that match a given property
                 *  @param {object} oSettings dataTables settings object
                 *  @param {string} sParam Parameter in aoColumns to look for - typically
                 *    bVisible or bSearchable
                 *  @returns {array} Array of indexes with matched properties
                 *  @memberof DataTable#oApi
                 */
                function _fnGetColumns(oSettings, sParam) {
                    let a = [];

                    $.map(oSettings.aoColumns, function(val, i) {
                        if (val[sParam]) {
                            a.push(i);
                        }
                    });

                    return a;
                }

            	/**
            	 * Adjust the table column widths for new data. Note: you would probably want to
            	 * do a redraw after calling this function!
            	 *  @param {object} settings dataTables settings object
            	 *  @memberof DataTable#oApi
            	 */
            	function _fnAdjustColumnSizing ( settings )
            	{
            		/* Not interested in doing column width calculation if auto-width is disabled */
            		if ( settings.oFeatures.bAutoWidth !== false )
            		{
            			var columns = settings.aoColumns;
            	
            			_fnCalculateColumnWidths( settings );
            			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
            			{
            				columns[i].nTh.style.width = columns[i].sWidth;
            			}
            		}
            	
            		var scroll = settings.oScroll;
            		if ( scroll.sY !== '' || scroll.sX !== '')
            		{
            			_fnScrollDraw( settings );
            		}
            	
            		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
            	}
            	
            	/**
            	 * Calculate the width of columns for the table
            	 *  @param {object} oSettings dataTables settings object
            	 *  @memberof DataTable#oApi
            	 */
            	function _fnCalculateColumnWidths ( oSettings ) {
            		var
            			table = oSettings.nTable,
            			columns = oSettings.aoColumns,
            			scroll = oSettings.oScroll,
            			scrollY = scroll.sY,
            			scrollX = scroll.sX,
            			scrollXInner = scroll.sXInner,
            			columnCount = columns.length,
            			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
            			headerCells = $('th', oSettings.nTHead),
            			tableWidthAttr = table.getAttribute('width'), // from DOM element
            			tableContainer = table.parentNode,
            			userInputs = false,
            			i, column, columnIdx, width, outerWidth,
            			browser = oSettings.oBrowser,
            			ie67 = browser.bScrollOversize;
            	
            		var styleWidth = table.style.width;
            		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
            			tableWidthAttr = styleWidth;
            		}
            	
            		/* Convert any user input sizes into pixel sizes */
            		for ( i=0 ; i<visibleColumns.length ; i++ ) {
            			column = columns[ visibleColumns[i] ];
            	
            			if ( column.sWidth !== null ) {
            				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
            	
            				userInputs = true;
            			}
            		}
            	
            		/* If the number of columns in the DOM equals the number that we have to
            		 * process in DataTables, then we can use the offsets that are created by
            		 * the web- browser. No custom sizes can be set in order for this to happen,
            		 * nor scrolling used
            		 */
            		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
            		     columnCount == _fnVisbleColumns( oSettings ) &&
            		     columnCount == headerCells.length
            		) {
            			for ( i=0 ; i<columnCount ; i++ ) {
            				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
            	
            				if ( colIdx !== null ) {
            					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
            				}
            			}
            		}
            		else
            		{
            			// Otherwise construct a single row, worst case, table with the widest
            			// node in the data, assign any user defined widths, then insert it into
            			// the DOM and allow the browser to do all the hard work of calculating
            			// table widths
            			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
            				.css( 'visibility', 'hidden' )
            				.removeAttr( 'id' );
            	
            			// Clean up the table body
            			tmpTable.find('tbody tr').remove();
            			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
            	
            			// Clone the table header and footer - we can't use the header / footer
            			// from the cloned table, since if scrolling is active, the table's
            			// real header and footer are contained in different table tags
            			tmpTable.find('thead, tfoot').remove();
            			tmpTable
            				.append( $(oSettings.nTHead).clone() )
            				.append( $(oSettings.nTFoot).clone() );
            	
            			// Remove any assigned widths from the footer (from scrolling)
            			tmpTable.find('tfoot th, tfoot td').css('width', '');
            	
            			// Apply custom sizing to the cloned header
            			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
            	
            			for ( i=0 ; i<visibleColumns.length ; i++ ) {
            				column = columns[ visibleColumns[i] ];
            	
            				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
            					_fnStringToCss( column.sWidthOrig ) :
            					'';
            	
            				// For scrollX we need to force the column width otherwise the
            				// browser will collapse it. If this width is smaller than the
            				// width the column requires, then it will have no effect
            				if ( column.sWidthOrig && scrollX ) {
            					$( headerCells[i] ).append( $('<div/>').css( {
            						width: column.sWidthOrig,
            						margin: 0,
            						padding: 0,
            						border: 0,
            						height: 1
            					} ) );
            				}
            			}
            	
            			// Find the widest cell for each column and put it into the table
            			if ( oSettings.aoData.length ) {
            				for ( i=0 ; i<visibleColumns.length ; i++ ) {
            					columnIdx = visibleColumns[i];
            					column = columns[ columnIdx ];
            	
            					$( _fnGetWidestNode( oSettings, columnIdx ) )
            						.clone( false )
            						.append( column.sContentPadding )
            						.appendTo( tr );
            				}
            			}
            	
            			// Tidy the temporary table - remove name attributes so there aren't
            			// duplicated in the dom (radio elements for example)
            			$('[name]', tmpTable).removeAttr('name');
            	
            			// Table has been built, attach to the document so we can work with it.
            			// A holding element is used, positioned at the top of the container
            			// with minimal height, so it has no effect on if the container scrolls
            			// or not. Otherwise it might trigger scrolling when it actually isn't
            			// needed
            			var holder = $('<div/>').css( scrollX || scrollY ?
            					{
            						position: 'absolute',
            						top: 0,
            						left: 0,
            						height: 1,
            						right: 0,
            						overflow: 'hidden'
            					} :
            					{}
            				)
            				.append( tmpTable )
            				.appendTo( tableContainer );
            	
            			// When scrolling (X or Y) we want to set the width of the table as 
            			// appropriate. However, when not scrolling leave the table width as it
            			// is. This results in slightly different, but I think correct behaviour
            			if ( scrollX && scrollXInner ) {
            				tmpTable.width( scrollXInner );
            			}
            			else if ( scrollX ) {
            				tmpTable.css( 'width', 'auto' );
            				tmpTable.removeAttr('width');
            	
            				// If there is no width attribute or style, then allow the table to
            				// collapse
            				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
            					tmpTable.width( tableContainer.clientWidth );
            				}
            			}
            			else if ( scrollY ) {
            				tmpTable.width( tableContainer.clientWidth );
            			}
            			else if ( tableWidthAttr ) {
            				tmpTable.width( tableWidthAttr );
            			}
            	
            			// Get the width of each column in the constructed table - we need to
            			// know the inner width (so it can be assigned to the other table's
            			// cells) and the outer width so we can calculate the full width of the
            			// table. This is safe since DataTables requires a unique cell for each
            			// column, but if ever a header can span multiple columns, this will
            			// need to be modified.
            			var total = 0;
            			for ( i=0 ; i<visibleColumns.length ; i++ ) {
            				var cell = $(headerCells[i]);
            				var border = cell.outerWidth() - cell.width();
            	
            				// Use getBounding... where possible (not IE8-) because it can give
            				// sub-pixel accuracy, which we then want to round up!
            				var bounding = browser.bBounding ?
            					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
            					cell.outerWidth();
            	
            				// Total is tracked to remove any sub-pixel errors as the outerWidth
            				// of the table might not equal the total given here (IE!).
            				total += bounding;
            	
            				// Width for each column to use
            				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
            			}
            	
            			table.style.width = _fnStringToCss( total );
            	
            			// Finished with the table - ditch it
            			holder.remove();
            		}
            	
            		// If there is a width attr, we want to attach an event listener which
            		// allows the table sizing to automatically adjust when the window is
            		// resized. Use the width attr rather than CSS, since we can't know if the
            		// CSS is a relative value or absolute - DOM read is always px.
            		if ( tableWidthAttr ) {
            			table.style.width = _fnStringToCss( tableWidthAttr );
            		}
            	
            		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
            			var bindResize = function () {
            				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
            					_fnAdjustColumnSizing( oSettings );
            				} ) );
            			};
            	
            			// IE6/7 will crash if we bind a resize event handler on page load.
            			// To be removed in 1.11 which drops IE6/7 support
            			if ( ie67 ) {
            				setTimeout( bindResize, 1000 );
            			}
            			else {
            				bindResize();
            			}
            	
            			oSettings._reszEvt = true;
            		}
            	}
            	
	            /**
                 * Covert the index of a visible column to the index in the data array (take account
                 * of hidden columns)
                 *  @param {object} oSettings dataTables settings object
                 *  @param {int} iMatch Visible column index to lookup
                 *  @returns {int} i the data index
                 *  @memberof DataTable#oApi
                 */
                function _fnVisibconstoColumnIndex(oSettings, iMatch) {
                    let aiVis = _fnGetColumns(oSettings, 'bVisible');

                    return typeof aiVis[iMatch] === 'number' ?
                        aiVis[iMatch] :
                        null;
                }

                /**
                 * Use the DOM source to create up an array of header cells. The idea here is to
                 * create a layout grid (array) of rows x columns, which contains a reference
                 * to the cell that that point in the grid (regardless of col/rowspan), such that
                 * any column / row could be removed and the new grid constructed
                 *  @param array {object} aLayout Array to store the calculated layout in
                 *  @param {node} nThead The header/footer element for the table
                 *  @memberof DataTable#oApi
                 */
                function _fnDetectHeader(aLayout, nThead) {
                    let nTrs = $(nThead).children('tr');
                    let nTr, nCell;
                    let i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
                    let bUnique;
                    let fnShiftCol = function(a, i, j) {
                        let k = a[i];
                        while (k[j]) {
                            j++;
                        }
                        return j;
                    };

                    aLayout.splice(0, aLayout.length);

                    /* We know how many rows there are in the layout - so prep it */
                    for (i = 0, iLen = nTrs.length; i < iLen; i++) {
                        aLayout.push([]);
                    }

                    /* Calculate a layout array */
                    for (i = 0, iLen = nTrs.length; i < iLen; i++) {
                        nTr = nTrs[i];
                        iColumn = 0;

                        /* For every cell in the row... */
                        nCell = nTr.firstChild;
                        while (nCell) {
                            if (nCell.nodeName.toUpperCase() == "TD" ||
                                nCell.nodeName.toUpperCase() == "TH") {
                                /* Get the col and rowspan attributes from the DOM and sanitise them */
                                iColspan = nCell.getAttribute('colspan') * 1;
                                iRowspan = nCell.getAttribute('rowspan') * 1;
                                iColspan = (!iColspan || iColspan === 0 || iColspan === 1) ? 1 : iColspan;
                                iRowspan = (!iRowspan || iRowspan === 0 || iRowspan === 1) ? 1 : iRowspan;

                                /* There might be colspan cells already in this row, so shift our target
                                 * accordingly
                                 */
                                iColShifted = fnShiftCol(aLayout, i, iColumn);

                                /* Cache calculation for unique columns */
                                bUnique = iColspan === 1 ? true : false;

                                /* If there is col / rowspan, copy the information into the layout grid */
                                for (l = 0; l < iColspan; l++) {
                                    for (k = 0; k < iRowspan; k++) {
                                        aLayout[i + k][iColShifted + l] = {
                                            "cell": nCell,
                                            "unique": bUnique
                                        };
                                        aLayout[i + k].nTr = nTr;
                                    }
                                }
                            }
                            nCell = nCell.nextSibling;
                        }
                    }
                }

                /**
                 * Get an array of unique th elements, one for each column
                 *  @param {object} oSettings dataTables settings object
                 *  @param {node} nHeader automatically detect the layout from this node - optional
                 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
                 *  @returns array {node} aReturn list of unique th's
                 *  @memberof DataTable#oApi
                 */
                function _fnGetUniqueThs(oSettings, nHeader, aLayout) {
                    let aReturn = [];
                    if (!aLayout) {
                        aLayout = oSettings.aoHeader;
                        if (nHeader) {
                            aLayout = [];
                            _fnDetectHeader(aLayout, nHeader);
                        }
                    }

                    for (let i = 0, iLen = aLayout.length; i < iLen; i++) {
                        for (let j = 0, jLen = aLayout[i].length; j < jLen; j++) {
                            if (aLayout[i][j].unique &&
                                (!aReturn[j] || !oSettings.bSortCellsTop)) {
                                aReturn[j] = aLayout[i][j].cell;
                            }
                        }
                    }

                    return aReturn;
                }

                /**
                 * Apply a given function to the display child nodes of an element array (typically
                 * TD children of TR rows
                 *  @param {function} fn Method to apply to the objects
                 *  @param array {nodes} an1 List of elements to look through for display children
                 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
                 *  @memberof DataTable#oApi
                 */
                function _fnApplyToChildren(fn, an1, an2) {
                    let index = 0,
                        i = 0,
                        iLen = an1.length;
                    let nNode1, nNode2;

                    while (i < iLen) {
                        nNode1 = an1[i].firstChild;
                        nNode2 = an2 ? an2[i].firstChild : null;

                        while (nNode1) {
                            if (nNode1.nodeType === 1) {
                                if (an2) {
                                    fn(nNode1, nNode2, index);
                                }
                                else {
                                    fn(nNode1, index);
                                }

                                index++;
                            }

                            nNode1 = nNode1.nextSibling;
                            nNode2 = an2 ? nNode2.nextSibling : null;
                        }

                        i++;
                    }
                }

                /**
                 * Append a CSS unit (only if required) to a string
                 *  @param {string} value to css-ify
                 *  @returns {string} value with css unit
                 *  @memberof DataTable#oApi
                 */
                function _fnStringToCss(s) {
                    if (s === null) {
                        return '0px';
                    }

                    if (typeof s == 'number') {
                        return s < 0 ?
                            '0px' :
                            s + 'px';
                    }

                    // Check it has a unit character already
                    return s.match(/\d$/) ?
                        s + 'px' :
                        s;
                }

                var
                    scroll = {
                        "bCollapse": true,
                        "iBarWidth": 17,
                        "sX": "",
                        "sXInner": "",
                        "sY": tableHeight + "px"
                    }, // set this programmatically
                    scrollX = scroll.sX,
                    scrollXInner = scroll.sXInner,
                    scrollY = scroll.sY,
                    barWidth = scroll.iBarWidth,
                    divHeader = $('div.dc-data-tables_scrollHead'),
                    divHeaderStyle = divHeader[0].style,
                    divHeaderInner = divHeader.children('div'),
                    divHeaderInnerStyle = divHeaderInner[0].style,
                    divHeaderTable = divHeaderInner.children('table'),
                    divBodyEl = $('div.dc-data-tables_scrollBody')[0],
                    divBody = $(divBodyEl),
                    divBodyStyle = divBodyEl.style,
                    divFooter = $('div.dc-data-tables_scrollFoot'),
                    divFooterInner = divFooter.children('div'),
                    divFooterTable = divFooterInner.children('table'),
                    header = $('div.dc-data-tables_scrollHead thead'),
                    dataTable = $('div.dc-data-tables_scrollBody table'),
                    tableEl = dataTable[0],
                    tableStyle = tableEl.style,
                    footer = $('div.dc-data-tables_scrollFoot tfoot'),
                    browser = {
                        "bScrollOversize": false,
                        "bScrollbarLeft": false,
                        "bBounding": true,
                        "barWidth": 17
                    }, // set this programmatically
                    ie67 = browser.bScrollOversize,
                    dtHeaderCells = [],
                    headerTrgEls, footerTrgEls,
                    headerSrcEls, footerSrcEls,
                    headerCopy, footerCopy,
                    headerWidths = [],
                    footerWidths = [],
                    headerContent = [],
                    footerContent = [],
                    idx, correction, sanityWidth,
                    zeroOut = function(nSizer) {
                        let style = nSizer.style;
                        style.paddingTop = "0";
                        style.paddingBottom = "0";
                        style.borderTopWidth = "0";
                        style.borderBottomWidth = "0";
                        style.height = 0;
                    };

                $('div.dc-data-tables_scrollHead table thead th').each(function() {
                    dtHeaderCells.push(this);
                })

                // If the scrollbar visibility has changed from the last draw, we need to
                // adjust the column sizes as the table width will have changed to account
                // for the scrollbar
                let scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;

                // if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
                // 	settings.scrollBarVis = scrollBarVis;
                // 	_fnAdjustColumnSizing( settings );
                // 	return; // adjust column sizing will call this function again
                // }
                // else {
                // 	settings.scrollBarVis = scrollBarVis;
                // }

                /*
                 * 1. Re-create the table inside the scrolling div
                 */

                // Remove the old minimised thead and tfoot elements in the inner table
                dataTable.children('thead, tfoot').remove();

                if (footer) {
                    footerCopy = footer.clone().prependTo(dataTable);
                    footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
                    footerSrcEls = footerCopy.find('tr');
                }

                // Clone the current header and footer elements and then place it into the inner table
                headerCopy = header.clone().prependTo(dataTable);
                headerTrgEls = header.find('tr'); // original header is in its own table
                headerSrcEls = headerCopy.find('tr');
                headerCopy.find('th, td').removeAttr('tabindex');

                /*
                 * 2. Take live measurements from the DOM - do not alter the DOM itself!
                 */

                // Remove old sizing and apply the calculated column widths
                // Get the unique column headers in the newly created (cloned) header. We want to apply the
                // calculated sizes to this header
                if (!scrollX) {
                    divBodyStyle.width = '100%';
                    divHeader[0].style.width = '100%';
                }

                $.each(headerCopy, function(i, el) {
                    // 			let idx = _fnVisibconstoColumnIndex( settings, i ); // function to determine if the columns has a width of greater than zero
                    idx = i;
                    // 			el.style.width = settings.aoColumns[idx].sWidth;
                    el.style.width = el.style.width;
                });

                if (footer) {
                    _fnApplyToChildren(function(n) {
                        n.style.width = "";
                    }, footerSrcEls);
                }

                // Size the table as a whole
                sanityWidth = dataTable.outerWidth();
                if (scrollX === "") {
                    // No x scrolling
                    tableStyle.width = "100%";

                    // IE7 will make the width of the table when 100% include the scrollbar
                    // - which is shouldn't. When there is a scrollbar we need to take this
                    // into account.
                    if (ie67 && (dataTable.find('tbody').height() > divBodyEl.offsetHeight ||
                            divBody.css('overflow-y') == "scroll")) {
                        tableStyle.width = _fnStringToCss(dataTable.outerWidth() - barWidth);
                    }

                    // Recalculate the sanity width
                    sanityWidth = dataTable.outerWidth();
                }
                else if (scrollXInner !== "") {
                    // legacy x scroll inner has been given - use it
                    tableStyle.width = _fnStringToCss(scrollXInner);

                    // Recalculate the sanity width
                    sanityWidth = dataTable.outerWidth();
                }

                // Hidden header should have zero height, so remove padding and borders. Then
                // set the width based on the real headers

                // Apply all styles in one pass
                _fnApplyToChildren(zeroOut, headerSrcEls);

                // Read all widths in next pass
                _fnApplyToChildren(function(nSizer) {
                    headerContent.push(nSizer.innerHTML);
                    headerWidths.push(_fnStringToCss($(nSizer).css('width')));
                }, headerSrcEls);

                // Apply all widths in final pass
                _fnApplyToChildren(function(nToSize, i) {
                    // Only apply widths to the DataTables detected header cells - this
                    // prevents complex headers from having contradictory sizes applied
                    if ($.inArray(nToSize, dtHeaderCells) !== -1) {
                        nToSize.style.width = headerWidths[i];
                    }
                }, headerTrgEls);

                $(headerSrcEls).height(0);

                /* Same again with the footer if we have one */
                if (footer) {
                    _fnApplyToChildren(zeroOut, footerSrcEls);

                    _fnApplyToChildren(function(nSizer) {
                        footerContent.push(nSizer.innerHTML);
                        footerWidths.push(_fnStringToCss($(nSizer).css('width')));
                    }, footerSrcEls);

                    _fnApplyToChildren(function(nToSize, i) {
                        nToSize.style.width = footerWidths[i];
                    }, footerTrgEls);

                    $(footerSrcEls).height(0);
                }

                /*
                 * 3. Apply the measurements
                 */

                // "Hide" the header and footer that we used for the sizing. We need to keep
                // the content of the cell so that the width applied to the header and body
                // both match, but we want to hide it compconstely. We want to also fix their
                // width to what they currently are
                _fnApplyToChildren(function(nSizer, i) {
                    nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + headerContent[i] + '</div>';
                    nSizer.style.width = headerWidths[i];
                }, headerSrcEls);

                if (footer) {
                    _fnApplyToChildren(function(nSizer, i) {
                        nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + footerContent[i] + '</div>';
                        nSizer.style.width = footerWidths[i];
                    }, footerSrcEls);
                }

                // Sanity check that the table is of a sensible width. If not then we are going to get
                // misalignment - try to prevent this by not allowing the table to shrink below its min width
                if (dataTable.outerWidth() < sanityWidth) {
                    // The min width depends upon if we have a vertical scrollbar visible or not */
                    correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
                            divBody.css('overflow-y') == "scroll")) ?
                        sanityWidth + barWidth :
                        sanityWidth;

                    // IE6/7 are a law unto themselves...
                    if (ie67 && (divBodyEl.scrollHeight >
                            divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) {
                        tableStyle.width = _fnStringToCss(correction - barWidth);
                    }

                }
                else {
                    correction = '100%';
                }

                // Apply to the container elements
                divBodyStyle.width = _fnStringToCss(correction);
                divHeaderStyle.width = _fnStringToCss(correction);

                /*
                 * 4. Clean up
                 */
                if (!scrollY) {
                    /* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
                     * the scrollbar height from the visible display, rather than adding it on. We need to
                     * set the height in order to sort this. Don't want to do it in any other browsers.
                     */
                    if (ie67) {
                        divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + barWidth);
                    }
                }

                /* Finally set the width's of the header and footer tables */
                let iOuterWidth = dataTable.outerWidth();
                divHeaderTable[0].style.width = _fnStringToCss(iOuterWidth);
                divHeaderInnerStyle.width = _fnStringToCss(iOuterWidth);

                // Figure out if there are scrollbar present - if so then we need a the header and footer to
                // provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
                let bScrolling = dataTable.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
                let padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right');
                divHeaderInnerStyle[padding] = bScrolling ? barWidth + "px" : "0px";

                // Correct DOM ordering for colgroup - comes before the thead
                dataTable.children('colgroup').insertBefore(dataTable.children('thead'));

                /* Adjust the position of the header in case we loose the y-scrollbar */
                divBody.scroll();

                // If sorting or filtering has occurred, jump the scrolling back to the top
                // only if we aren't holding the position
                // 		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
                // 			divBodyEl.scrollTop = 0;
                // 		}
            }
            _fnScrollDraw();
        });

    dc.renderAll();

    d3.select('.number-display').classed('top-line', true);

    // define mouseover and mouseout events
    function bindHover() {
        
        document.body.addEventListener('mousemove',function( e ) {
            if (e.target.parentElement.classList.contains('row')) {
                var d = d3.select(e.target).data()[0];
                let key = d.key;
                let amount = currFormat(d.value.amount);
                let count = d.value.count;
                let percent = perFormat(d.value.percent);
                showDetail(e, key, amount, count, percent)
            } else if (e.target.nodeName == 'rect' && e.target.classList.contains('bar')) {
                let d = d3.select(e.target).data()[0];
                let key = d.layer;
                let amount = currFormat(d.data.value.amount);
                showDetail(e, key, amount, null, null)
            } else if (e.target.parentElement.classList.contains('pie-slice') || e.target.classList.contains('pie-label')) {
                var d = d3.select(e.target).data()[0].data;
                let key = d.key;
                let amount = currFormat(d.value.amount);
                let count = d.value.count;
                let percent = perFormat(d.value.percent);
                showDetail(e, key, amount, count, percent)
            }
        });
        
        document.body.addEventListener('mouseout',function( e ) {
            if (e.target.parentElement.classList.contains('row') || e.target.nodeName == 'rect' || e.target.parentElement.classList.contains('pie-slice')  || e.target.classList.contains('pie-label')) hideDetail();
        });
    }

    bindHover();

    // Change the date header to reflect the date and time of the data
    d3.select('#dateHeader').text(formatDate(new Date()));

    // enable sort on data table
    $('.dc-data-tables_scrollHead table > thead > tr').on('click', 'th', function() {
        // http://stackoverflow.com/questions/21113513/reorder-datatable-by-column#answer-30946896
        let header = $(this);
        let column = header.attr("data-col");
        // JavaScript and jQuery by Jon Duckett, pp.560 - 565
        if (header.is('.sorting_asc') || header.is('.sorting_desc')) {
            header.toggleClass('sorting_asc sorting_desc');
        }
        else {
            header.addClass('sorting_asc').removeClass('sorting');
            header.siblings().removeClass('sorting_asc sorting_desc');
            header.siblings().addClass('sorting');
        }

        let sortOrder;
        if (!header.hasClass('sorting_asc')) {
            sortOrder = d3.descending;
        }
        else {
            sortOrder = d3.ascending;
        }

        tableDim.dispose();
        tableDim = ndx.dimension(function(d) {
            return d[column];
        });
        dataTable
            .dimension(tableDim)
            .sortBy(function(d) {
                return d[column];
            })
            .size(Infinity)
            .order(sortOrder);
        dataTable.redraw();
    });

    // add selected item information as table in modal
    $('#data-table').on('click', 'tbody tr a', function(event) {
        let thisTable = d3.select($(this).closest('table')[0]);
        let thisRow = d3.select($(this).closest('tr')[0]);
        let cells = thisRow.selectAll('td')[0].map(function(d) {
            let text;
            if (d.firstChild !== undefined && d.firstChild.textContent !== undefined) {
                text = d.firstChild.textContent;
            }
            else {
                text = d.textContent;
            }
            return text;
        });
        let headers = thisTable.selectAll('thead th')[0].map(function(d) {
            return d.textContent;
        });
        let data = headers.map(function(d, i) {
            let obj = {};
            obj.key = d;
            obj.value = cells[i];
            return obj;
        });

        $('#tableDiv table').remove();
        let table = d3.select('#tableDiv').append('table').attr({
            'id': 'modal-table',
            'class': 'table table-bordered'
        }).style({
            'width': '100%',
            'table-layout': 'fixed'
        });
        let tbody = table.append('tbody');

        let rows = tbody.selectAll('tr')
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

    var debounce = function(fn, timeout) 
    {
      var timeoutID = -1;
      return function() {
        if (timeoutID > -1) {
          window.clearTimeout(timeoutID);
        }
        timeoutID = window.setTimeout(fn, timeout);
      }
    };
    
    var debounced_draw = debounce(function() {
      dataTable.redraw();
    }, 50);
    
    $(window).resize(debounced_draw);

    
}



function exportTable() {
    export_table_to_excel('data-table', 'Grants');
} // parameters: 0, id of html table, 1, name of workbook

function toggleComposition() {
    let emailNode = $('#emailComposition');
    
    if (emailNode.hasClass('hidden')) {
        emailNode.removeClass('hidden');
    } else {
        emailNode.addClass('hidden');
    }
}

function sendMail() {
    
	let greeting = $('#emailText')[0].value;
	let tableData = d3.selectAll("#grantsModal .modal-body table tbody tr").data();
	let details = d3.selectAll("#grantsModal .modal-body table tbody tr td:first-child")[0];
	// change this to reference one of the get user functions above
	let from = SP.ClientContext.get_current().get_web().get_currentUser().get_title();
	let grantId = details[0].__data__.value;
	let to = details[12].__data__.value;
	processSendEmails(from, to, greeting, grantId, tableData);
}

function processSendEmails(from, to, greeting, grantId, tableData) {

	let body = '<p>' + greeting + '</p><br/>' + '<table style="border: 1px solid #ddd;margin-bottom:20px;border-spacing:0;border-collapse:collapse;background-color:transparent;"><tbody style="box-sizing: border-box;display:table-row-group;vertical-align: middle;border-color:inherit">';
	
	tableData.forEach(function(d) {
		body += '<tr style="box-sizing: border-box">';
		body += '<td style="color:#fff;background-color:#0193d7;font-weight:900;color:#fff;background-color:#0193d7;border: 1px solid #ddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">' + d.key + '</td>';
		body += '<td style="border: 1px solid #ddd;padding: 8px;line-height: 1.4285714;vertical-align: top;">' + d.value + '</td></tr>';
	});
	
	body += '</tbody></table>';
	
    let subject = 'Fundraising Dashboard Commitment #' + grantId;

    // Call sendEmail function
    //
    sendEmail(from, to, body, subject);
}

function sendEmail(from, to, body, subject) {
    //Get the relative url of the site
    let siteurl = _spPageContextInfo.webServerRelativeUrl;
    let urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
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
    let schema = {};
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
    let peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

    // Get information about all users.
    let users = peoplePicker.GetAllUserInfo();
    let userInfo = '';
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        for (let userProperty in user) { 
            userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
        }
    }
    $('#resolvedUsers').html(userInfo);

    // Get user keys.
    let keys = peoplePicker.GetAllUserKeys();
    $('#userKeys').html(keys);

    // Get the first user's ID by using the login name.
    getUserId(users[0].Key);
}

// Get the user ID.
function getUserId(loginName) {
    let context = new SP.ClientContext.get_current();
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
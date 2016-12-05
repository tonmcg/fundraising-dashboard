function getData() {

	var siteUrl = "";
	var test = "";

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

	function isSharePoint(test,listName,fields,expand) {
	
		var endpointUrl = "";

		if (!test) {
			var columns = fields + "ID,Title";
			endpointUrl = siteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items?$select=" + columns + "&$expand=" + expand + "&$top=500";
		}
		else {
			endpointUrl = "../SiteAssets/data/" + listName + ".json";
		}

		return endpointUrl;

	}

	function populateDropdown(data, id) {
		var options = '<option value=""></option>';
		$.each(data, function(key, val) {
			options += '<option value="' + val.Id + '">' + val.Title + '</option>';
		});
		var select = $('#' + id);
		select.append(options);
		if (id === 'fiscalYear') {
			var today = moment();
			var monthIndex = +moment(today).format('M');
			var year = +moment(today).format('YYYY');
			if (monthIndex > 6) {
				year = year + 1;
			}
			select.val((year - 2012).toString());
		} else if (id === 'duration') {
			select.val("1");
		}
	}

	function filterSelection(data, filter, id) {
		var options = '';
		$.each(data, function(key, val) {
			if (val.DonorType.Title === filter) {
				options += '<option value="' + val.Id + '">' + val.Title + '</option>';
			}
		});
		var select = $('#' + id);
		select.append(options);
	}

	function getListItems(url, success, failure) {
	    $.ajax({
	        url: url,
	        method: "GET",
            headers: {
                "accept": "application/json;odata=nometadata",
                "content-Type": "application/json;odata=verbose"
            },
	        success: function (data) {
	            success(data.value);
	        },
	        error: function (data) {
	            failure(data);
	        }
	    });
	}
	
	getListItems(isSharePoint(test,'Programs',"",""),
		function(items){
			if(items.length > 0)
				populateDropdown(items,'program');
			},
		function(error){
			console.log(error.responseText);   
		}
	);
	getListItems(isSharePoint(test,'FiscalYears',"",""),
		function(items){
			if(items.length > 0)
				populateDropdown(items,'fiscalYear');
			},
		function(error){
			console.log(error.responseText);   
		}
	);	
	getListItems(isSharePoint(test,'FundingStatuses',"",""),
		function(items){
			if(items.length > 0)
				populateDropdown(items,'fundingStatus');
			},
		function(error){
			console.log(error.responseText);   
		}
	);
	getListItems(isSharePoint(test,'DonorTypes',"",""),
		function(items){
			if(items.length > 0)
				populateDropdown(items,'donorType');
			},
		function(error){
			console.log(error.responseText);   
		}
	);
	getListItems(isSharePoint(test,'FieldSites',"",""),
		function(items){
			if(items.length > 0)
				populateDropdown(items,'fieldSite');
			},
		function(error){
			console.log(error.responseText);   
		}
	);
	getListItems(isSharePoint(test,'Durations',"",""),
		function(items){
			if(items.length > 0)
				populateDropdown(items,'duration');
			},
		function(error){
			console.log(error.responseText);   
		}
	);
	getListItems(isSharePoint(test,'Grants','Project,',""),
		function(items){
			if(items.length > 0)
				loadTypeahead(items,'project');
			},
		function(error){
			console.log(error.responseText);   
		}
	);

    // bind change event for cascading dropdowns
    // only fires immediately when the user makes a selection
    $('#donorType').on('change', function() {
        $('#donor').empty();
        var donorType = $('#donorType :selected').text();
		getListItems(isSharePoint(test,'Donors','DonorType/Title,','DonorType'),
			function(items){
				if(items.length > 0)
					items = items.sort(function(a,b) {
						if (a.Title.toLowerCase() < b.Title.toLowerCase()) return -1;
						if (a.Title.toLowerCase() > b.Title.toLowerCase()) return 1;
						return 0;
					});
					filterSelection(items,donorType,'donor');
				},
			function(error){
				console.log(error.responseText);   
			}
		);
    });
	
}

function loadTypeahead(array,id) {
	
	var field = toTitleCase(id);

	$('#' + id + 'Container .typeahead').typeahead('destroy');

	var substringMatcher = function(strs) {
		return function findMatches(q, cb) {
			var matches, substringRegex;
			
			// an array that will be populated with substring matches
			matches = [];
			
			// regex used to determine if a string contains the substring `q`
			substringRegex = new RegExp(q, 'i');
			
			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substringRegex.test(str)) {
					matches.push(str);
				}
			});
			
			cb(matches);
		};
	};
	
	var uniqeArray = getUniqueValues(array);

	$('#' + id + 'Container .typeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: id + 's',
			source: substringMatcher(uniqeArray)
		}
	);

	function getUniqueValues(arr) {
		var newArray = [];
		
		$.each(arr,function(i, g) {
			if(newArray.indexOf(g[field]) < 0) {
				newArray.push(g[field]);
			}
		});
		return newArray;
	}
	
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
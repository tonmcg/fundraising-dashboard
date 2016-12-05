function sendRequest() {

    function onSubmitSuccess() {
        $('#successModal').modal('show');
    }

    function onSubmitError(err) {
        alert(JSON.stringify(err));
    }
    
    try {
        if (typeof _spPageContextInfo.webServerRelativeUrl !== 'undefined') {
            UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
            var siteUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Grants')/items";
        }
    }
    catch (e) {
        siteUrl = undefined;
    }
    
    function setDefaultSite(selectedVal) {
    	var returnVal = 0;
    	if (selectedVal == "") {
    		returnVal = 10;
    	} else {
    		returnVal = selectedVal;
    	}
    	return returnVal;
    }
    
    $.ajax({
        url: siteUrl,
        type: 'POST',
        dataType: 'JSON',
        data: JSON.stringify({
            '__metadata': {
                'type': 'SP.Data.GrantsListItem'
            },
            'ProgramId': $('#program :selected').val(),
            'FiscalYearId': $('#fiscalYear :selected').val(),
            'DonorTypeId': $('#donorType :selected').val(),
            'DonorId': $('#donor :selected').val(),
            'FundingStatusId': $('#fundingStatus :selected').val(),
            'FieldSiteId': setDefaultSite($('#fieldSite :selected').val()),
            'DurationId': $('#duration :selected').val(),
            'Project': $('#project').val(),
            'Notes': $('#notes').val(),
            'ProgramCommitment': $('#budgetCommitment').val(),
            'FieldSiteCommitment': $('#fieldSiteCommitment').val(),
            'TotalCommitment': $('#totalCommitment').val()
        }),
        headers: {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose; charset=utf-8',
            'X-RequestDigest': $('#__REQUESTDIGEST').val()
        },
        success: function() {
            onSubmitSuccess();
        },
        error: onSubmitError
    });
}
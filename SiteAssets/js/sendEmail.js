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
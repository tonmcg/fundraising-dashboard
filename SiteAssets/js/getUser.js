function getCurrentUser() {
	var ctx = SP.ClientContext.get_current();
	var web = ctx.get_web();
	var currentUserObj = web.get_currentUser();
	ctx.load(currentUserObj);
	ctx.executeQueryAsync(
		function() {
			var displayName = currentUserObj.get_title();
			console.log(displayName);
			if (displayName == "Ashleigh McGovern" || displayName == "Carolyn Hicks") {
				var foundElement = $('li:contains("Site Contents")');
				foundElement.removeClass('hidden');
			}
		},
		function(sender, args) {
			console.log("An error occured: " + args.get_message());
		}); //end get currentUser display
}
getCurrentUser();
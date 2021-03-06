var WebDeveloper = WebDeveloper || {};

WebDeveloper.Dashboard = WebDeveloper.Dashboard || {};

// Initializes the page
WebDeveloper.Dashboard.initialize = function(styleInformation, theme)
{
	var content = $("#content");

	// Fades out the previous content before updating
	content.fadeOut(WebDeveloper.Generated.animationDuration, function()
	{
		content.css("visibility", "hidden").show().html(styleInformation);

		$(".breadcrumb").css("margin-right", ($("#web-developer-copy-ancestor-path").outerWidth() + 10) + "px");

		WebDeveloper.Generated.resizeAncestors(true);
		WebDeveloper.Generated.initializeCommonElements();
		WebDeveloper.Generated.initializeSyntaxHighlight(theme);

		// Fades in the new content
		content.hide().css("visibility", "visible").fadeIn(WebDeveloper.Generated.animationDuration);
	});
};

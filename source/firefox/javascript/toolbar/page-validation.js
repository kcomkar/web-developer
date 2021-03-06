var WebDeveloper = WebDeveloper || {};

WebDeveloper.PageValidation								= WebDeveloper.PageValidation || {};
WebDeveloper.PageValidation.cssValidator	= null;
WebDeveloper.PageValidation.htmlValidator = null;
WebDeveloper.PageValidation.selectedTab		= 0;

// Clears the CSS validation details for the page
WebDeveloper.PageValidation.clearCSSValidation = function()
{
	var validationButton = document.getElementById("web-developer-css-validation");

	// If the validation button is set
	if(validationButton)
	{
		validationButton.label = "";

		// If the validation button has a class attribute
		if(validationButton.hasAttribute("class"))
		{
			validationButton.removeAttribute("class");
		}
	}

	// If the CSS validator is set
	if(WebDeveloper.PageValidation.cssValidator)
	{
		WebDeveloper.PageValidation.cssValidator.cleanUp();
	}
};

// Clears the HTML validation details for the page
WebDeveloper.PageValidation.clearHTMLValidation = function()
{
	var validationButton = document.getElementById("web-developer-html-validation");

	// If the validation button is set
	if(validationButton)
	{
		validationButton.label = "";

		// If the validation button has a class attribute
		if(validationButton.hasAttribute("class"))
		{
			validationButton.removeAttribute("class");
		}
	}

	// If the HTML validator is set
	if(WebDeveloper.PageValidation.htmlValidator)
	{
		WebDeveloper.PageValidation.htmlValidator.cleanUp();
	}
};

// Creates the page validation toolbar
WebDeveloper.PageValidation.createToolbar = function()
{
	var contentDocument = WebDeveloper.Common.getContentDocument();

	WebDeveloper.PageValidation.cssValidator	= new WebDeveloperValidateCSS();
	WebDeveloper.PageValidation.htmlValidator = new WebDeveloperValidateHTML();

	WebDeveloper.PageValidation.updateCSSValidation(contentDocument);
	WebDeveloper.PageValidation.updateHTMLValidation(contentDocument);

	WebDeveloper.Common.configureElement(document.getElementById("web-developer-page-validation-toolbar"), "hidden", false);

	// Try to get the tab browser
	try
	{
		var tabBrowser = WebDeveloper.Common.getTabBrowser();

		// If the tab browser is set
		if(tabBrowser)
		{
			var tabContainer = tabBrowser.tabContainer;

			tabBrowser.addEventListener("load", WebDeveloper.PageValidation.pageLoad, true);
			tabBrowser.addEventListener("unload", WebDeveloper.PageValidation.pageUnload, true);

			// If the tab container is set
			if(tabContainer)
			{
				tabContainer.addEventListener("TabSelect", WebDeveloper.PageValidation.tabSelect, false);
			}
		}
	}
	catch(exception)
	{
		// Ignore
	}
};

// Displays a page validation toolbar
WebDeveloper.PageValidation.displayPageValidation = function(display)
{
	WebDeveloper.PageValidation.clearCSSValidation();
	WebDeveloper.PageValidation.clearHTMLValidation();

	// If displaying a page magnifier
	if(display)
	{
		WebDeveloper.PageValidation.createToolbar();
	}
	else
	{
		WebDeveloper.PageValidation.removeToolbar();
	}
};

// Checks if the page is validatable
WebDeveloper.PageValidation.isValidatablePage = function(uri)
{
	// If the URI is set and is validatable
	if(uri && uri != "about:blank" && uri != "http://www.hermish.com/check_this.cfm" && uri != "http://jigsaw.w3.org/css-validator/validator" && uri != "http://validator.w3.org/check")
	{
		return true;
	}

	return false;
};

// Handles the page being loaded
WebDeveloper.PageValidation.pageLoad = function(event)
{
	var originalTarget = event.originalTarget;

	// If the event came from an HTML document and it is not a frame
	if(originalTarget instanceof HTMLDocument && !originalTarget.defaultView.frameElement)
	{
		var contentDocument = WebDeveloper.Common.getContentDocument();

		WebDeveloper.PageValidation.clearCSSValidation();
		WebDeveloper.PageValidation.clearHTMLValidation();

		// If the page is validatable
		if(WebDeveloper.PageValidation.isValidatablePage(contentDocument.documentURI))
		{
			WebDeveloper.PageValidation.updateCSSValidation(contentDocument);
			WebDeveloper.PageValidation.updateHTMLValidation(contentDocument);
		}
	}
};

// Handles the page being unloaded
WebDeveloper.PageValidation.pageUnload = function(event)
{
	var originalTarget = event.originalTarget;

	// If the event came from an HTML document and it is not a frame
	if(originalTarget instanceof HTMLDocument && !originalTarget.defaultView.frameElement)
	{
		WebDeveloper.PageValidation.clearCSSValidation();
		WebDeveloper.PageValidation.clearHTMLValidation();
	}
};

// Handles a tab being selected
WebDeveloper.PageValidation.tabSelect = function(event)
{
	var tabBrowser	= WebDeveloper.Common.getTabBrowser();
	var selectedTab = tabBrowser.mTabBox.selectedIndex;

	// If the selected tab is different
	if(selectedTab != WebDeveloper.PageValidation.selectedTab)
	{
		var contentDocument = WebDeveloper.Common.getContentDocument();

		WebDeveloper.PageValidation.selectedTab = selectedTab;

		WebDeveloper.PageValidation.clearCSSValidation();
		WebDeveloper.PageValidation.clearHTMLValidation();

		// If the page is validatable
		if(WebDeveloper.PageValidation.isValidatablePage(contentDocument.documentURI))
		{
			WebDeveloper.PageValidation.updateCSSValidation(contentDocument);
			WebDeveloper.PageValidation.updateHTMLValidation(contentDocument);
		}
	}
};

// Removes the page validation toolbar
WebDeveloper.PageValidation.removeToolbar = function()
{
	WebDeveloper.PageValidation.cssValidator	= null;
	WebDeveloper.PageValidation.htmlValidator = null;

	WebDeveloper.Common.configureElement(document.getElementById("web-developer-page-validation-toolbar"), "hidden", true);

	// Try to get the tab browser
	try
	{
		var tabBrowser = WebDeveloper.Common.getTabBrowser();

		// If the tab browser is set
		if(tabBrowser)
		{
			var tabContainer = tabBrowser.tabContainer;

			tabBrowser.removeEventListener("load", WebDeveloper.PageValidation.pageLoad, true);
			tabBrowser.removeEventListener("unload", WebDeveloper.PageValidation.pageUnload, true);

			// If the tab container is set
			if(tabContainer)
			{
				tabContainer.removeEventListener("TabSelect", WebDeveloper.PageValidation.tabSelect, false);
			}
		}
	}
	catch(exception)
	{
		// Ignore
	}
};

// Updates the CSS validation for the page
WebDeveloper.PageValidation.updateCSSValidation = function(contentDocument)
{
	WebDeveloper.PageValidation.updateValidation(document.getElementById("web-developer-css-validation"));
	WebDeveloper.PageValidation.cssValidator.cleanUp();
	WebDeveloper.PageValidation.cssValidator.validateBackgroundCSS(Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(contentDocument.documentURI, null, null), WebDeveloper.Content.getCSS());
};

// Updates the CSS validation details for the page
WebDeveloper.PageValidation.updateCSSValidationDetails = function()
{
	// If the CSS validation request is set and is ready
	if(WebDeveloper.PageValidation.cssValidator.validationRequest && WebDeveloper.PageValidation.cssValidator.validationRequest.readyState == 4)
	{
		WebDeveloper.PageValidation.updateValidationDetails(WebDeveloper.PageValidation.cssValidator.validationRequest, document.getElementById("web-developer-css-validation"));
		WebDeveloper.PageValidation.cssValidator.cleanUp();
	}
};

// Updates the HTML validation for the page
WebDeveloper.PageValidation.updateHTMLValidation = function(contentDocument)
{
	WebDeveloper.PageValidation.updateValidation(document.getElementById("web-developer-html-validation"));
	WebDeveloper.PageValidation.htmlValidator.cleanUp();
	WebDeveloper.PageValidation.htmlValidator.validateBackgroundHTML(Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(contentDocument.documentURI, null, null));
};

// Updates the HTML validation details for the page
WebDeveloper.PageValidation.updateHTMLValidationDetails = function()
{
	// If the HTML validation request is set and is ready
	if(WebDeveloper.PageValidation.htmlValidator.validationRequest && WebDeveloper.PageValidation.htmlValidator.validationRequest.readyState == 4)
	{
		WebDeveloper.PageValidation.updateValidationDetails(WebDeveloper.PageValidation.htmlValidator.validationRequest, document.getElementById("web-developer-html-validation"));
		WebDeveloper.PageValidation.htmlValidator.cleanUp();
	}
};

// Updates the validation for the page
WebDeveloper.PageValidation.updateValidation = function(validationButton)
{
	// If the validation button is set
	if(validationButton)
	{
		validationButton.label = WebDeveloper.Locales.getString("validating");

		validationButton.setAttribute("class", "loading");
	}
};

// Updates the validation details for the page
WebDeveloper.PageValidation.updateValidationDetails = function(validationRequest, validationButton)
{
	// Try to check the validation status
	try
	{
		// If the validation status is set to success
		if(validationRequest.status == 200)
		{
			var validationStatus = validationRequest.getResponseHeader("X-W3C-Validator-Status");

			// If the validation button and validation status are set
			if(validationButton && validationStatus)
			{
				// If the validation status is valid
				if(validationStatus == "Valid")
				{
					validationButton.label = WebDeveloper.Locales.getString("valid");

					validationButton.setAttribute("class", "valid");
				}
				else
				{
					validationButton.label = WebDeveloper.Locales.getString("invalid") + ": " + validationRequest.getResponseHeader("X-W3C-Validator-Errors") + " " + WebDeveloper.Locales.getString("errors").toLowerCase();

					validationButton.setAttribute("class", "invalid");
				}
			}
		}
		else
		{
			// If the validation button is set
			if(validationButton)
			{
				validationButton.label = "";

				// If the validation button has a class
				if(validationButton.hasAttribute("class"))
				{
					validationButton.removeAttribute("class");
				}
			}
		}
	}
	catch(exception)
	{
		// Ignore
	}
};

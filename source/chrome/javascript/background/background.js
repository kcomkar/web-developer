var WebDeveloper = WebDeveloper || {};

WebDeveloper.Background	= WebDeveloper.Background || {};

// Converts an RGB color into a hex color
WebDeveloper.Background.convertRGBToHex = function(rgb)
{
	var blue	= parseInt(rgb[2], 10).toString(16).toLowerCase();
	var green = parseInt(rgb[1], 10).toString(16).toLowerCase();
	var red		= parseInt(rgb[0], 10).toString(16).toLowerCase();

	// If the color is only 1 character
	if(blue.length == 1)
	{
		blue = "0" + blue;
	}

	// If the color is only 1 character
	if(green.length == 1)
	{
		green = "0" + green;
	}

	// If the color is only 1 character
	if(red.length == 1)
	{
		red = "0" + red;
	}

	return "#" + red + green + blue;
};

// Gets the current color
WebDeveloper.Background.getColor = function(x, y, eventType)
{
	chrome.tabs.captureVisibleTab(null, function(dataUrl)
	{
		var image = new Image();

		image.src	= dataUrl;

		image.onload = function()
		{
			var canvas	= document.createElement("canvas");
			var color		= null;
			var context = canvas.getContext("2d");

			canvas.height = image.naturalHeight;
			canvas.width	= image.naturalWidth;

			context.clearRect(0, 0, image.naturalWidth, image.naturalHeight);
			context.drawImage(image, 0, 0);

			color = WebDeveloper.Background.convertRGBToHex(context.getImageData(x, y, 1, 1).data);

			chrome.tabs.executeScript(null, { "code": 'document.getElementById("web-developer-color-picker-' + eventType + '-color").setAttribute("style", "background-color: ' + color + ' !important"); document.getElementById("web-developer-color-picker-' + eventType + '-hex").innerHTML = "' + color + '";' });
		};
	});

	return {};
};

// Gets the content from a set of URLs
WebDeveloper.Background.getContentFromURLs = function(urls)
{
	var contentFromURLs = [];
	var contentURL			= null;
	var request					= null;
	var response				= null;

	// Loop through the urls
	for(var i = 0, l = urls.length; i < l; i++)
	{
		contentURL = urls[i];

		// Try to get the content
		try
		{
			request = new XMLHttpRequest();

			request.open("get", contentURL, false);
			request.send(null);

			response = request.responseText;
		}
		catch(exception)
		{
			response = null;
		}

		contentFromURLs.push({ "content": response, "url": contentURL });
	}

	return contentFromURLs;
};

// Gets the styles from CSS
WebDeveloper.Background.getStylesFromCSS = function(cssDocuments)
{
	var contentDocument = null;
	var cssContent			= null;
	var styles					= "";
	var documents				= cssDocuments.documents;
	var styleSheets			= [];

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];
		styleSheets			= styleSheets.concat(contentDocument.styleSheets);

		// If there are embedded styles
		if(contentDocument.embedded)
		{
			styles += contentDocument.embedded;
		}
	}

	cssContent = WebDeveloper.Background.getContentFromURLs(styleSheets);

	// Loop through the CSS content
	for(i = 0, l = cssContent.length; i < l; i++)
	{
		styles += cssContent[i].content;
	}

	return { "css": styles };
};

// Initializes a generated tab
WebDeveloper.Background.initializeGeneratedTab = function(url, data, locale)
{
	var extensionTab = null;
	var tabs				 = chrome.extension.getViews({ "type": "tab" });

	// Loop through the tabs
	for(var i = 0, l = tabs.length; i < l; i++)
	{
		extensionTab = tabs[i];

		// If the tab has a matching URL and has not been initialized
		if(extensionTab.location.href == url && !extensionTab.WebDeveloper.Generated.initialized)
		{
			extensionTab.WebDeveloper.Generated.initialized = true;

			extensionTab.WebDeveloper.Generated.initialize(data, locale);
		}
	}
};

// Initializes a validation tab
WebDeveloper.Background.initializeValidationTab = function(url, data)
{
	var extensionTab = null;
	var tabs				 = chrome.extension.getViews({ "type": "tab" });

	// Loop through the tabs
	for(var i = 0, l = tabs.length; i < l; i++)
	{
		extensionTab = tabs[i];

		// If the tab has a matching URL and has not been initialized
		if(extensionTab.location.href == url && !extensionTab.WebDeveloper.Validation.initialized)
		{
			extensionTab.WebDeveloper.Validation.initialized = true;

			extensionTab.WebDeveloper.Validation.initialize(data);
		}
	}
};

// Opens a generated tab
WebDeveloper.Background.openGeneratedTab = function(tabURL, tabIndex, data, locale)
{
	chrome.tabs.create({ "index": tabIndex + 1, "url": tabURL }, function(openedTab)
	{
		var tabLoaded = function(tabId, tabInformation, tab)
		{
			// If this is the opened tab and it finished loading
			if(tabId == openedTab.id && tabInformation.status == "complete")
			{
				WebDeveloper.Background.initializeGeneratedTab(tabURL, data, locale);

				chrome.tabs.onUpdated.removeListener(tabLoaded);
			}
		};

		chrome.tabs.onUpdated.addListener(tabLoaded);
	});
};

// Handles any background requests
WebDeveloper.Background.request = function(request, sender, sendResponse)
{
	// If the request type is to get the current color
	if(request.type == "get-color")
	{
		sendResponse(WebDeveloper.Background.getColor(request.x, request.y, request.eventType));
	}
	else if(request.type == "get-content-from-urls")
	{
		sendResponse(WebDeveloper.Background.getContentFromURLs(request.urls));
	}
	else
	{
		// Unknown request
		sendResponse({});
	}
};

// Validates the CSS of the local page
WebDeveloper.Background.validateLocalCSS = function(tabURL, tabIndex, css)
{
	chrome.tabs.create({ "index": tabIndex + 1, "url": tabURL }, function(openedTab)
	{
		var tabLoaded = function(tabId, tabInformation, tab)
		{
			// If this is the opened tab and it finished loading
			if(tabId == openedTab.id && tabInformation.status == "complete")
			{
				WebDeveloper.Background.initializeValidationTab(tabURL, WebDeveloper.Background.getStylesFromCSS(css));

				chrome.tabs.onUpdated.removeListener(tabLoaded);
			}
		};

		chrome.tabs.onUpdated.addListener(tabLoaded);
	});
};

// Validates the HTML of the local page
WebDeveloper.Background.validateLocalHTML = function(tabURL, tabIndex, validateURL)
{
	chrome.tabs.create({ "index": tabIndex + 1, "url": tabURL }, function(openedTab)
	{
		var tabLoaded = function(tabId, tabInformation, tab)
		{
			// If this is the opened tab and it finished loading
			if(tabId == openedTab.id && tabInformation.status == "complete")
			{
				WebDeveloper.Background.initializeValidationTab(tabURL, WebDeveloper.Background.getContentFromURLs([validateURL]));

				chrome.tabs.onUpdated.removeListener(tabLoaded);
			}
		};

		chrome.tabs.onUpdated.addListener(tabLoaded);
	});
};

chrome.extension.onRequest.addListener(WebDeveloper.Background.request);

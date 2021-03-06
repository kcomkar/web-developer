var WebDeveloper = WebDeveloper || {};

WebDeveloper.Outline = WebDeveloper.Outline || {};

// Outlines all block level elements
WebDeveloper.Outline.outlineBlockLevelElements = function(documents)
{
	var contentDocument = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-block-level-elements-before", contentDocument, false);
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-block-level-elements.css", "web-developer-outline-block-level-elements", contentDocument, false);
	}
};

// Outlines all deprecated elements
WebDeveloper.Outline.outlineDeprecatedElements = function(documents)
{
	var contentDocument = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-deprecated-elements-before", contentDocument, false);
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-deprecated-elements.css", "web-developer-outline-deprecated-elements", contentDocument, false);
	}
};

// Outlines all external links
WebDeveloper.Outline.outlineExternalLinks = function(outline, documents)
{
	var contentDocument = null;
	var location				= null;
	var protocol				= null;
	var styleElement		= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		// If outlining external links
		if(outline)
		{
			location		 = contentDocument.location;
			protocol		 = location.protocol.replace(/:/gi, "\\:");
			styleElement = contentDocument.createElement("style");

			styleElement.setAttribute("id", "web-developer-outline-external-links");
			styleElement.appendChild(contentDocument.createTextNode("a:not([href^=http\\:\\/\\/" + location.hostname.replace(/\\/gi, "\\.") + "]):not([href^=https\\:\\/\\/" + location.hostname.replace(/\\/gi, "\\.") + "]) { outline: 1px solid #f00 !important; }"));
			styleElement.appendChild(contentDocument.createTextNode("a:not([href^=http\\:\\/\\/]):not([href^=https\\:\\/\\/]) { outline-style: none !important; }"));

			WebDeveloper.Common.getDocumentHeadElement(contentDocument).appendChild(styleElement);
		}
		else
		{
			WebDeveloper.Common.removeStyleSheet("web-developer-outline-external-links", contentDocument);
		}
	}
};

// Outlines all floated elements
WebDeveloper.Outline.outlineFloatedElements = function(outline, documents)
{
	var contentDocument = null;
	var float						= null;
	var floatedElements = null;
	var node						= null;
	var treeWalker			= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		// If outlining floated elements
		if(outline)
		{
			treeWalker = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, null, false);

			// While the tree walker has more nodes
			while((node = treeWalker.nextNode()) !== null)
			{
				float = node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("float").cssText;

				// If this element has a background image and it is a URL
				if(float && float != "none")
				{
					WebDeveloper.Common.addClass(node, "web-developer-outline-floated-elements");
				}
			}
		}
		else
		{
			floatedElements = contentDocument.getElementsByClassName("web-developer-outline-floated-elements");

			// While there are floated elements
			while(floatedElements.length > 0)
			{
				WebDeveloper.Common.removeClass(floatedElements[0], "web-developer-outline-floated-elements");
			}
		}

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-floated-elements.css", "web-developer-outline-floated-elements", contentDocument, false);
	}
};

// Outlines all frames
WebDeveloper.Outline.outlineFrames = function(documents)
{
	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-frames.css", "web-developer-outline-frames", documents[i], false);
	}
};

// Outlines all headingss
WebDeveloper.Outline.outlineHeadings = function(documents)
{
	var contentDocument = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-headings-before", contentDocument, false);
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-headings.css", "web-developer-outline-headings", contentDocument, false);
	}
};

// Outlines all non-secure elements
WebDeveloper.Outline.outlineNonSecureElements = function(documents)
{
	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-non-secure-elements.css", "web-developer-outline-non-secure-elements", documents[i], false);
	}
};

// Outlines all positioned elements
WebDeveloper.Outline.outlinePositionedElements = function(positionType, outline, documents)
{
	var className			= "web-developer-outline-" + positionType + "-positioned-elements";
	var contentDocument = null;
	var node						= null;
	var position				= null;
	var treeWalker			= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		// If outlining positioned elements
		if(outline)
		{
			treeWalker = contentDocument.createTreeWalker(WebDeveloper.Common.getDocumentBodyElement(contentDocument), NodeFilter.SHOW_ELEMENT, null, false);

			// While the tree walker has more nodes
			while((node = treeWalker.nextNode()) !== null)
			{
				position = node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyCSSValue("position").cssText;

				// If this element has a background image and it is a URL
				if(position && position == positionType)
				{
					WebDeveloper.Common.addClass(node, className);
				}
			}
		}
		else
		{
			var positionedElements = contentDocument.getElementsByClassName(className);

			// While there are positioned elements
			while(positionedElements.length > 0)
			{
				WebDeveloper.Common.removeClass(positionedElements[0], className);
			}
		}

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-positioned-elements.css", className, contentDocument, false);
	}
};

// Outlines all table captions
WebDeveloper.Outline.outlineTableCaptions = function(documents)
{
	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-table-captions.css", "web-developer-outline-table-captions", documents[i], false);
	}
};

// Outlines all table cells
WebDeveloper.Outline.outlineTableCells = function(documents)
{
	var contentDocument = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-outline-table-cells-before", contentDocument, false);
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-table-cells.css", "web-developer-outline-table-cells", contentDocument, false);
	}
};

// Outlines all tables
WebDeveloper.Outline.outlineTables = function(documents)
{
	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/outline/outline-tables.css", "web-developer-outline-tables", documents[i], false);
	}
};

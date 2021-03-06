var WebDeveloper = WebDeveloper || {};

WebDeveloper.Ruler			= WebDeveloper.Ruler || {};
WebDeveloper.Ruler.html = '<h1>@name@ Ruler</h1><input id="web-developer-ruler-height"><label for="web-developer-ruler-height">Height</label><input id="web-developer-ruler-width"><label for="web-developer-ruler-width">Width</label>';

// Creates the ruler toolbar
WebDeveloper.Ruler.createRulerToolbar = function(contentDocument)
{
	var rulerToolbar = contentDocument.createElement("div");

	rulerToolbar.setAttribute("id", "web-developer-ruler-toolbar");
	rulerToolbar.setAttribute("class", "web-developer-toolbar");

	rulerToolbar.innerHTML = WebDeveloper.Ruler.html;

	WebDeveloper.Common.getDocumentBodyElement(contentDocument).appendChild(rulerToolbar);
};

// Removes the ruler toolbar
WebDeveloper.Ruler.removeRulerToolbar = function(contentDocument)
{
	WebDeveloper.Common.removeMatchingElements("#web-developer-ruler-toolbar", contentDocument);
};

// Updates the ruler information
WebDeveloper.Ruler.updateInformation = function(contentDocument)
{
	var ruler = contentDocument.getElementById("web-developer-ruler");

	// If the ruler is set
	if(ruler)
	{
		contentDocument.getElementById("web-developer-ruler-height").value = ruler.offsetHeight + "px";
		contentDocument.getElementById("web-developer-ruler-width").value  = ruler.offsetWidth + "px";
	}
};

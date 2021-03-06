// Constructs a validate HTML object
function WebDeveloperValidateHTML()
{
	this.file							 = null;
	this.fileElement			 = null;
	this.formElement			 = null;
	this.validationRequest = null;
}

// Cleans up
WebDeveloperValidateHTML.prototype.cleanUp = function()
{
	// If the file is set
	if(this.file)
	{
		// Try to delete the file
		try
		{
			this.file.remove(false);
		}
		catch(exception)
		{
			// Ignore
		}

		this.file = null;
	}

	// If the validation request is set
	if(this.validationRequest)
	{
		this.validationRequest.abort();
	}
};

// Creates a source file
WebDeveloperValidateHTML.prototype.createSourceFile = function(uri)
{
	var temporaryDirectory = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile);

	// If the temporary directory exists, is a directory and is writable
	if(temporaryDirectory.exists() && temporaryDirectory.isDirectory() && temporaryDirectory.isWritable())
	{
		var fileName	 = "";
		var sourceFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

		// Try to get the host
		try
		{
			fileName = uri.host;
		}
		catch(exception)
		{
			// Ignore
		}

		temporaryDirectory.append("web-developer-" + fileName + "-" + new Date().getTime() + ".html");
		sourceFile.initWithPath(temporaryDirectory.path);

		return sourceFile;
	}
	else
	{
		WebDeveloper.Common.displayError(WebDeveloper.Locales.getString("validateHTML"), WebDeveloper.Locales.getFormattedString("temporaryDirectoryFailed", [temporaryDirectory.path]));

		return null;
	}
};

// Returns the post data
WebDeveloperValidateHTML.prototype.getPostData = function()
{
	// Try to get the post data
	try
	{
		var sessionHistory = getWebNavigation().sessionHistory;
		var entry					 = sessionHistory.getEntryAtIndex(sessionHistory.index, false).QueryInterface(Components.interfaces.nsISHEntry);

		return entry.postData;
	}
	catch(exception)
	{
		return null;
	}
};

// Saves the HTML
WebDeveloperValidateHTML.prototype.saveHTML = function(uri)
{
	var webBrowserPersistInterface = Components.interfaces.nsIWebBrowserPersist;
	var webBrowserPersist					 = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(webBrowserPersistInterface);

	webBrowserPersist.persistFlags		 = webBrowserPersistInterface.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION | webBrowserPersistInterface.PERSIST_FLAGS_FROM_CACHE | webBrowserPersistInterface.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
	webBrowserPersist.progressListener = this;

	webBrowserPersist.saveURI(uri, null, uri, this.getPostData(), null, this.file);
};

// Submits the background request to validate the HTML
WebDeveloperValidateHTML.prototype.submitBackgroundRequest = function()
{
	var boundaryString	 = new Date().getTime();
	var boundary				 = "--" + boundaryString;
	var converter				 = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	var inputStream			 = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	var scriptableStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
	var requestBody			 = boundary + "\r\nContent-Disposition: form-data; name=\"uploaded_file\"; filename=\"" + this.file.leafName + "\"\r\n";

	converter.charset													= WebDeveloper.Common.getContentDocument().characterSet;
	this.validationRequest.onreadystatechange = WebDeveloper.PageValidation.updateHTMLValidationDetails;

	inputStream.init(this.file, parseInt(1, 16), parseInt(444, 8), null);
	scriptableStream.init(inputStream);

	requestBody += "Content-Type: text/html\r\n\r\n";
	requestBody += converter.ConvertToUnicode(scriptableStream.read(scriptableStream.available())) + "\r\n";
	requestBody += boundary + "--";

	scriptableStream.close();
	inputStream.close();

	this.validationRequest.open("post", "http://validator.w3.org/check", true);

	// Try to set the request header
	try
	{
		this.validationRequest.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundaryString);
		this.validationRequest.sendAsBinary(requestBody);
	}
	catch(exception)
	{
		// Reset the validation request
		this.validationRequest = new XMLHttpRequest();
	}
};

// Submits the form to validate the HTML
WebDeveloperValidateHTML.prototype.submitForm = function()
{
	var that = this;

	this.fileElement.value = this.file.path;

	this.formElement.submit();

	window.setTimeout(function() { that.cleanUp(); }, 1000);
};

// Validate the HTML from the given URI in the background
WebDeveloperValidateHTML.prototype.validateBackgroundHTML = function(uri)
{
	this.file = this.createSourceFile(uri);

	// If the validation request is not set
	if(!this.validationRequest)
	{
		this.validationRequest = new XMLHttpRequest();
	}

	this.saveHTML(uri);
};

// Validate the HTML from the given URI
WebDeveloperValidateHTML.prototype.validateHTML = function(uri)
{
	var validationURL = WebDeveloper.Common.getChromeURL("validation/html.html");
	var tab						= WebDeveloper.Common.getTabBrowser().getBrowserForTab(WebDeveloper.Common.openURL(validationURL));
	var that					= this;

	tab.addEventListener("load", function()
	{
		// If this is the validation page
		if(tab.currentURI.spec == validationURL)
		{
			var contentDocument = tab.contentDocument;

			that.file				 = that.createSourceFile(uri);
			that.fileElement = contentDocument.getElementById("file");
			that.formElement = contentDocument.getElementById("form");

			that.saveHTML(uri);
		}
	}, true);
};

// Called when the progress state changes
WebDeveloperValidateHTML.prototype.onStateChange = function(webProgress, request, stateFlags, status)
{
	// If the progress has stopped
	if(stateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)
	{
		// If the file is set and exists
		if(this.file && this.file.exists())
		{
			// If the validation request is set
			if(this.validationRequest)
			{
				this.submitBackgroundRequest();
			}
			else
			{
				this.submitForm();
			}
		}
	}
};

// Indicates the interfaces this object supports
WebDeveloperValidateHTML.prototype.QueryInterface = function(id)
{
	// If the query is for a supported interface
	if(id.equals(Components.interfaces.nsISupports) || id.equals(Components.interfaces.nsIWebProgressListener))
	{
		return this;
	}

	throw Components.results.NS_NOINTERFACE;
};

// Dummy methods requiring implementations
WebDeveloperValidateHTML.prototype.onLocationChange = function(webProgress, request, location) {};
WebDeveloperValidateHTML.prototype.onProgressChange = function(webProgress, request, currentSelfProgress, maximumSelfProgress, currentTotalProgress, maximumTotalProgress) {};
WebDeveloperValidateHTML.prototype.onSecurityChange = function(webProgress, request, state) {};
WebDeveloperValidateHTML.prototype.onStatusChange		= function(webProgress, request, status, message) {};

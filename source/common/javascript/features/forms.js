var WebDeveloper = WebDeveloper || {};

WebDeveloper.Forms = WebDeveloper.Forms || {};

// Clears all form fields
WebDeveloper.Forms.clearFormFields = function(documents)
{
	var clearedForms = 0;
	var elementType	 = null;
	var formElement	 = null;
	var formElements = null;
	var forms				 = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		forms = documents[i].forms;

		// Loop through the forms
		for(var j = 0, m = forms.length; j < m; j++)
		{
			formElements = forms[j].elements;

			// Loop through the form elements
			for(var k = 0, n = formElements.length; k < n; k++)
			{
				formElement	= formElements[k];
				elementType	= formElement.tagName.toLowerCase();

				// If this is an input element
				if(elementType == "input")
				{
					// If the form element has a type attribute
					if(formElement.hasAttribute("type"))
					{
						elementType = formElement.getAttribute("type");

						// If the element type is checkbox or radio
						if(elementType == "checkbox" || elementType == "radio")
						{
							formElement.checked = false;
						}
						else if(elementType != "hidden" && elementType != "reset" && elementType != "submit")
						{
							formElement.value = "";
						}
					}
					else
					{
						formElement.value = "";
					}
				}
				else if(elementType == "select")
				{
					formElement.selectedIndex = -1;
				}
				else if(elementType == "textarea")
				{
					formElement.value = "";
				}
			}

			clearedForms++;
		}
	}

	// If one form was cleared
	if(clearedForms == 1)
	{
		WebDeveloper.Common.displayNotification("clearFormFieldsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("clearFormFieldsMultipleResult", [clearedForms]);
	}
};

// Clears all radio buttons
WebDeveloper.Forms.clearRadioButtons = function(documents)
{
	var clearedRadioButtons = 0;
	var radioButtons				= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		radioButtons = documents[i].querySelectorAll("input[type=radio]");

		// Loop through the radio buttons
		for(var j = 0, m = radioButtons.length; j < m; j++)
		{
			radioButtons[j].checked = false;

			clearedRadioButtons++;
		}
	}

	// If one radio button was cleared
	if(clearedRadioButtons == 1)
	{
		WebDeveloper.Common.displayNotification("clearRadioButtonsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("clearRadioButtonsMultipleResult", [clearedRadioButtons]);
	}
};

// Converts the methods of all forms
WebDeveloper.Forms.convertFormMethods = function(method, documents)
{
	var convertedForms = 0;
	var form					 = null;
	var forms					 = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		forms = documents[i].forms;

		// Loop through all the forms
		for(var j = 0, m = forms.length; j < m; j++)
		{
			form = forms[j];

			// If this form is not already the right method
			if((!form.hasAttribute("method") && method == "post") || (form.hasAttribute("method") && form.getAttribute("method").toLowerCase() != method))
			{
				form.setAttribute("method", method);

				convertedForms++;
			}
		}
	}

	// If one form was converted
	if(convertedForms == 1)
	{
		WebDeveloper.Common.displayNotification("convertFormMethodsSingleResult", [method]);
	}
	else
	{
		WebDeveloper.Common.displayNotification("convertFormMethodsMultipleResult", [convertedForms, method]);
	}
};

// Converts select elements to text inputs
WebDeveloper.Forms.convertSelectElementsToTextInputs = function(documents)
{
	var contentDocument					= null;
	var convertedSelectElements = 0;
	var inputElement						= null;
	var parentNode							= null;
	var selectElement						= null;
	var selectElements					= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];
		selectElements	= contentDocument.getElementsByTagName("select");

		// While there are select elements
		while(selectElements.length > 0)
		{
			inputElement	= contentDocument.createElement("input");
			selectElement = selectElements[0];
			parentNode		= selectElement.parentNode;

			inputElement.value = selectElement.value;

			// If the select element has an id attribute
			if(selectElement.hasAttribute("id"))
			{
				inputElement.setAttribute("id", selectElement.getAttribute("id"));
			}

			// If the select element has a name attribute
			if(selectElement.hasAttribute("name"))
			{
				inputElement.setAttribute("name", selectElement.getAttribute("name"));
			}

			parentNode.insertBefore(inputElement, selectElement);
			parentNode.removeChild(selectElement);

			convertedSelectElements++;
		}
	}

	// If one select element was converted
	if(convertedSelectElements == 1)
	{
		WebDeveloper.Common.displayNotification("convertSelectElementsToTextInputsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("convertSelectElementsToTextInputsMultipleResult", [convertedSelectElements]);
	}
};

// Converts text inputs to textareas
WebDeveloper.Forms.convertTextInputsToTextareas = function(documents)
{
	var contentDocument			= null;
	var convertedTextInputs = 0;
	var elementType					= null;
	var inputElement				= null;
	var inputElements				= null;
	var parentNode					= null;
	var textareaElement			= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		// Uses query selector all so that it is not a live node list
		inputElements	= contentDocument.querySelectorAll("input");

		// Loop through the input tags
		for(var j = 0, m = inputElements.length; j < m; j++)
		{
			inputElement = inputElements[j];
			elementType  = inputElement.getAttribute("type");

			// If the form element does not have a type attribute or it is not a text input
			if(!elementType || (elementType != "button" && elementType != "checkbox" && elementType != "file" && elementType != "hidden" && elementType != "image" && elementType != "radio" && elementType != "reset" && elementType != "submit"))
			{
				textareaElement	= contentDocument.createElement("textarea");
				parentNode			= inputElement.parentNode;

				textareaElement.value = inputElement.value;

				// If the select element has an id attribute
				if(inputElement.hasAttribute("id"))
				{
					textareaElement.setAttribute("id", inputElement.getAttribute("id"));
				}

				// If the select element has a name attribute
				if(inputElement.hasAttribute("name"))
				{
					textareaElement.setAttribute("name", inputElement.getAttribute("name"));
				}

				parentNode.insertBefore(textareaElement, inputElement);
				parentNode.removeChild(inputElement);

				convertedTextInputs++;
			}
		}
	}

	// If one text input was converted
	if(convertedTextInputs == 1)
	{
		WebDeveloper.Common.displayNotification("convertTextInputsToTextareasSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("convertTextInputsToTextareasMultipleResult", [convertedTextInputs]);
	}
};

// Displays the details about all forms
WebDeveloper.Forms.displayFormDetails = function(display, documents)
{
	var contentDocument = null;
	var inputElement		= null;
	var inputElements		= null;
	var spanElement			= null;
	var text						= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];
		inputElements		= contentDocument.getElementsByTagName("input");

		WebDeveloper.Common.removeMatchingElements("span.web-developer-display-form-details", contentDocument);

		// Loop through the input tags
		for(var j = 0, m = inputElements.length; j < m; j++)
		{
			inputElement = inputElements[j];

			// If the input element was un-hidden
			if(inputElement.hasAttribute("web-developer-unhidden"))
			{
				inputElement.removeAttribute("web-developer-unhidden");
				inputElement.setAttribute("type", "hidden");
			}

			// If displaying the form details
			if(display)
			{
				spanElement = contentDocument.createElement("span");
				text				= "<input";

				// If the element is hidden
				if(inputElement.hasAttribute("type") && inputElement.getAttribute("type").toLowerCase() == "hidden")
				{
					inputElement.setAttribute("web-developer-unhidden", true);
					inputElement.removeAttribute("type");
				}

				// If the element has an autocomplete attribute
				if(inputElement.hasAttribute("autocomplete"))
				{
					text += ' autocomplete="' + inputElement.getAttribute("autocomplete") + '"';
				}

				// If the element has an id attribute
				if(inputElement.hasAttribute("id"))
				{
					text += ' id="' + inputElement.getAttribute("id") + '"';
				}

				// If the element has a maxlength attribute
				if(inputElement.hasAttribute("maxlength"))
				{
					text += ' maxlength="' + inputElement.getAttribute("maxlength") + '"';
				}

				// If the element has an name attribute
				if(inputElement.hasAttribute("name"))
				{
					text += ' name="' + inputElement.getAttribute("name") + '"';
				}

				// If the element has a size attribute
				if(inputElement.hasAttribute("size"))
				{
					text += ' size="' + inputElement.getAttribute("size") + '"';
				}

				// If the element has a type attribute
				if(inputElement.hasAttribute("type"))
				{
					text += ' type="' + inputElement.getAttribute("type") + '"';

					// If the element is a checkbox or radio button
					if(inputElement.getAttribute("type").toLowerCase() == "checkbox" || inputElement.getAttribute("type").toLowerCase() == "radio")
					{
						text += ' value="' + inputElement.value + '"';
					}
				}

				text += ">";

				spanElement.setAttribute("class", "web-developer-display-form-details");
				spanElement.appendChild(contentDocument.createTextNode(text));
				inputElement.parentNode.insertBefore(spanElement, inputElement);
			}
		}

		// If displaying the form details
		if(display)
		{
			var buttonElement		 = null;
			var buttonElements	 = contentDocument.getElementsByTagName("button");
			var selectElement		 = null;
			var selectElements	 = contentDocument.getElementsByTagName("select");
			var textAreaElement  = null;
			var textAreaElements = contentDocument.getElementsByTagName("textarea");

			// Loop through the button tags
			for(j = 0, m = buttonElements.length; j < m; j++)
			{
				buttonElement = buttonElements[j];
				spanElement	= contentDocument.createElement("span");
				text					= "<button";

				// If the element has an id attribute
				if(buttonElement.hasAttribute("id"))
				{
					text += ' id="' + buttonElement.getAttribute("id") + '"';
				}

				// If the element has an name attribute
				if(buttonElement.hasAttribute("name"))
				{
					text += ' name="' + buttonElement.getAttribute("name") + '"';
				}

				// If the element has a value
				if(buttonElement.value)
				{
					text += ' value="' + buttonElement.value + '"';
				}

				text += ">";

				spanElement.setAttribute("class", "web-developer-display-form-details");
				spanElement.appendChild(contentDocument.createTextNode(text));
				buttonElement.parentNode.insertBefore(spanElement, buttonElement);
			}

			// Loop through the select tags
			for(j = 0, m = selectElements.length; j < m; j++)
			{
				selectElement = selectElements[j];
				spanElement	= contentDocument.createElement("span");
				text					= "<select";

				// If the element has an id attribute
				if(selectElement.hasAttribute("id"))
				{
					text += ' id="' + selectElement.getAttribute("id") + '"';
				}

				// If the element has an name attribute
				if(selectElement.hasAttribute("name"))
				{
					text += ' name="' + selectElement.getAttribute("name") + '"';
				}

				// If the element has a value
				if(selectElement.value)
				{
					text += ' value="' + selectElement.value + '"';
				}

				text += ">";

				spanElement.setAttribute("class", "web-developer-display-form-details");
				spanElement.appendChild(contentDocument.createTextNode(text));
				selectElement.parentNode.insertBefore(spanElement, selectElement);
			}

			// Loop through the textarea tags
			for(j = 0, m = textAreaElements.length; j < m; j++)
			{
				textAreaElement = textAreaElements[j];
				spanElement			= contentDocument.createElement("span");
				text						= "<textarea";

				// If the element has an id attribute
				if(textAreaElement.hasAttribute("id"))
				{
					text += ' id="' + textAreaElement.getAttribute("id") + '"';
				}

				// If the element has a maxlength attribute
				if(textAreaElement.hasAttribute("maxlength"))
				{
					text += ' maxlength="' + textAreaElement.getAttribute("maxlength") + '"';
				}

				// If the element has an name attribute
				if(textAreaElement.hasAttribute("name"))
				{
					text += ' name="' + textAreaElement.getAttribute("name") + '"';
				}

				text += ">";

				spanElement.setAttribute("class", "web-developer-display-form-details");
				spanElement.appendChild(contentDocument.createTextNode(text));
				textAreaElement.parentNode.insertBefore(spanElement, textAreaElement);
			}
		}

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/before.css", "web-developer-display-form-details-before", contentDocument, false);
		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/forms/display-form-details.css", "web-developer-display-form-details", contentDocument, false);
	}
};

// Displays all passwords
WebDeveloper.Forms.displayPasswords = function(documents)
{
	var displayedPasswords = 0;
	var passwords					 = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		passwords = documents[i].querySelectorAll("input[type=password]");

		// Loop through the passwords
		for(var j = 0, m = passwords.length; j < m; j++)
		{
			passwords[j].removeAttribute("type");

			displayedPasswords++;
		}
	}

	// If one password displayed
	if(displayedPasswords == 1)
	{
		WebDeveloper.Common.displayNotification("displayPasswordsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("displayPasswordsMultipleResult", [displayedPasswords]);
	}
};

// Enables auto completion on all elements
WebDeveloper.Forms.enableAutoCompletion = function(documents)
{
	var autoCompleteElements = null;
	var enabledElements			 = 0;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		autoCompleteElements = documents[i].querySelectorAll("[autocomplete]");

		// Loop through the auto complete elements
		for(var j = 0, m = autoCompleteElements.length; j < m; j++)
		{
			autoCompleteElements[j].removeAttribute("autocomplete");

			enabledElements++;
		}
	}

	// If one element was enabled
	if(enabledElements == 1)
	{
		WebDeveloper.Common.displayNotification("enableAutoCompletionSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("enableAutoCompletionMultipleResult", [enabledElements]);
	}
};

// Enables the form elements
WebDeveloper.Forms.enableFormElements = function(formElements)
{
	var enabledElements = 0;
	var formElement			= null;

	// Loop through the form elements
	for(var i = 0, l = formElements.length; i < l; i++)
	{
		formElement = formElements[i];

		// If the form element is disabled
		if(formElement.disabled)
		{
			formElement.disabled = false;

			enabledElements++;
		}
	}

	return enabledElements;
};

// Enables all form fields
WebDeveloper.Forms.enableFormFields = function(documents)
{
	var contentDocument = null;
	var enabledFields		= 0;
	var forms						= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];
		forms						= contentDocument.forms;

		// Loop through the forms
		for(var j = 0, m = forms.length; j < m; j++)
		{
			enabledFields += WebDeveloper.Forms.enableFormElements(forms[j].elements);
		}

		enabledFields += WebDeveloper.Forms.enableFormElements(contentDocument.querySelectorAll("input[type=image]"));
	}

	// If one field was enabled
	if(enabledFields == 1)
	{
		WebDeveloper.Common.displayNotification("enableFormFieldsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("enableFormFieldsMultipleResult", [enabledFields]);
	}
};

// Expands all select elements
WebDeveloper.Forms.expandSelectElements = function(documents)
{
	var selectElement		 = null;
	var selectElements	 = null;
	var selectLength		 = null;
	var selectSize			 = null;
	var expandedElements = 0;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		selectElements = documents[i].querySelectorAll("select");

		// Loop through the select elements
		for(var j = 0, m = selectElements.length; j < m; j++)
		{
			selectElement = selectElements[j];
			selectLength	= selectElement.options.length;
			selectSize		= selectElement.getAttribute("size");

			// If the select size is not set and the select has more than one option or the select has more options than it's size
			if((!selectSize && selectLength > 1) || (selectLength > selectSize))
			{
				selectElement.setAttribute("size", selectLength);

				expandedElements++;
			}
		}
	}

	// If one element was expanded
	if(expandedElements == 1)
	{
		WebDeveloper.Common.displayNotification("expandSelectElementsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("expandSelectElementsMultipleResult", [expandedElements]);
	}
};

// Makes all form fields writable
WebDeveloper.Forms.makeFormFieldsWritable = function(documents)
{
	var readOnlyElements = null;
	var writableElements = 0;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		readOnlyElements = documents[i].querySelectorAll("[readonly]");

		// Loop through the read only elements
		for(var j = 0, m = readOnlyElements.length; j < m; j++)
		{
			readOnlyElements[j].removeAttribute("readonly");

			writableElements++;
		}
	}

	// If one element was enabled
	if(writableElements == 1)
	{
		WebDeveloper.Common.displayNotification("makeFormFieldsWritableSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("makeFormFieldsWritableMultipleResult", [writableElements]);
	}
};

// Outlines all form fields without labels
WebDeveloper.Forms.outlineFormFieldsWithoutLabels = function(outline, documents)
{
	var contentDocument					= null;
	var formElement							= null;
	var formElementId						= null;
	var formElements						= null;
	var formFieldsWithoutLabels = null;
	var forms										= null;
	var labelElement						= null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument = documents[i];

		// If outlining form fields without labels
		if(outline)
		{
			forms = contentDocument.forms;

			// Loop through the forms
			for(var j = 0, m = forms.length; j < m; j++)
			{
				formElements = forms[j].elements;

				// Loop through the form elements
				for(var k = 0, n = formElements.length; k < n; k++)
				{
					formElement	 = formElements[k];
					labelElement = formElement.parentNode;

					// If the parent element is not a label
					if(labelElement.tagName.toLowerCase() != "label")
					{
						formElementId	= formElement.getAttribute("id");

						// If the form element has an id attribute
						if(formElementId)
						{
							labelElement = contentDocument.querySelector("label[for=" + formElementId + "]");

							// If no label element was found
							if(!labelElement)
							{
								WebDeveloper.Common.addClass(formElement, "web-developer-outline-form-fields-without-labels");
							}
						}
					}
				}
			}
		}
		else
		{
			formFieldsWithoutLabels = contentDocument.getElementsByClassName("web-developer-outline-form-fields-without-labels");

			// While there are form fields without labels
			while(formFieldsWithoutLabels.length > 0)
			{
				WebDeveloper.Common.removeClass(formFieldsWithoutLabels[0], "web-developer-outline-form-fields-without-labels");
			}
		}

		WebDeveloper.Common.toggleStyleSheet("features/style-sheets/forms/outline-form-fields-without-labels.css", "web-developer-outline-form-fields-without-labels", contentDocument, false);
	}
};

// Populates all form fields
WebDeveloper.Forms.populateFormFields = function(documents, emailAddress)
{
	var contentDocument					 = null;
	var inputElement						 = null;
	var inputElementMaxlength		 = null;
	var inputElementName				 = null;
	var inputElements						 = null;
	var inputElementType				 = null;
	var option									 = null;
	var options									 = null;
	var selectElement						 = null;
	var selectElements					 = null;
	var textAreaElement					 = null;
	var textAreaElements				 = null;
	var textAreaElementMaxlength = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		contentDocument  = documents[i];
		inputElements		 = contentDocument.getElementsByTagName("input");
		selectElements	 = contentDocument.getElementsByTagName("select");
		textAreaElements = contentDocument.getElementsByTagName("textarea");

		// Loop through the input tags
		for(var j = 0, m = inputElements.length; j < m; j++)
		{
			inputElement = inputElements[j];

			// If the input element is not disabled
			if(!inputElement.disabled)
			{
				inputElementType = inputElement.getAttribute("type");

				// If the input element value is not set and the type is not set or is email, password or text
				if(!WebDeveloper.Common.trim(inputElement.value) && (!inputElementType || inputElementType.toLowerCase() == "email" || inputElementType.toLowerCase() == "password" || inputElementType.toLowerCase() == "search" || inputElementType.toLowerCase() == "text" || inputElementType.toLowerCase() == "url"))
				{
					inputElementName			= inputElement.getAttribute("name");
					inputElementMaxlength = inputElement.getAttribute("maxlength");

					// If the input element type is set and is email or is text and the name contains email
					if((inputElementType && inputElementType.toLowerCase() == "email") || ((!inputElementType || inputElementType == "text") && inputElementName && inputElementName.toLowerCase().indexOf("email") >= 0))
					{
						inputElement.value = emailAddress;
					}
					else if(inputElementType && inputElementType.toLowerCase() == "password")
					{
						inputElement.value = WebDeveloper.Locales.getString("password").toLowerCase();
					}
					else if(inputElementType && inputElementType.toLowerCase() == "url")
					{
						inputElement.value = "http://localhost/";
					}
					else if(inputElementName && inputElementName.toLowerCase().indexOf("zip") >= 0)
					{
						inputElement.value = "90210";
					}
					else if(inputElementName)
					{
						inputElement.value = inputElementName;
					}
					else
					{
						inputElement.value = "@name@";
					}

					// If the input element has a maxlength attribute
					if(inputElementMaxlength && inputElement.value > inputElementMaxlength)
					{
						inputElement.value = inputElement.value.substr(0, inputElementMaxlength);
					}
				}
				else if(inputElementType && (inputElementType.toLowerCase() == "checkbox" || inputElementType.toLowerCase() == "radio"))
				{
					inputElement.checked = true;
				}
			}
		}

		// Loop through the select tags
		for(j = 0, m = selectElements.length; j < m; j++)
		{
			selectElement = selectElements[j];

			// If the select element is not disabled and the value is not set
			if(!selectElement.disabled && !WebDeveloper.Common.trim(selectElement.value))
			{
				options = selectElement.options;

				// Loop through the options
				for(var k = 0, n = options.length; k < n; j++)
				{
					option = options.item(k);

					// If the option is set and the option text and option value are not empty
					if(option && WebDeveloper.Common.trim(option.text) && WebDeveloper.Common.trim(option.value))
					{
						selectElement.selectedIndex = k;

						break;
					}
				}
			}
		}

		// Loop through the text area tags
		for(j = 0, m = textAreaElements.length; j < m; j++)
		{
			textAreaElement = textAreaElements[j];

			// If the text area element is not disabled and the value is not set
			if(!textAreaElement.disabled && !WebDeveloper.Common.trim(textAreaElement.value))
			{
				textAreaElementMaxlength = textAreaElement.getAttribute("maxlength");
				textAreaElement.value		 = textAreaElement.getAttribute("name");

				// If the text area element has a maxlength attribute
				if(textAreaElementMaxlength && textAreaElement.value > textAreaElementMaxlength)
				{
					textAreaElement.value = textAreaElement.value.substr(0, textAreaElementMaxlength);
				}
			}
		}
	}
};

// Removes maximum lengths from all elements
WebDeveloper.Forms.removeMaximumLengths = function(documents)
{
	var alteredElements				= 0;
	var maximumLengthElements = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		maximumLengthElements = documents[i].querySelectorAll("[maxlength]");

		// Loop through the maximum length elements
		for(var j = 0, m = maximumLengthElements.length; j < m; j++)
		{
			maximumLengthElements[j].removeAttribute("maxlength");

			alteredElements++;
		}
	}

	// If one element was altered
	if(alteredElements == 1)
	{
		WebDeveloper.Common.displayNotification("removeMaximumLengthsSingleResult");
	}
	else
	{
		WebDeveloper.Common.displayNotification("removeMaximumLengthsMultipleResult", [alteredElements]);
	}
};

// Toggles all checkboxes
WebDeveloper.Forms.toggleCheckboxes = function(check, documents)
{
	var checkboxes = null;

	// Loop through the documents
	for(var i = 0, l = documents.length; i < l; i++)
	{
		checkboxes = documents[i].querySelectorAll("input[type=checkbox]");

		// Loop through the checkboxes
		for(var j = 0, m = checkboxes.length; j < m; j++)
		{
			checkboxes[j].checked = check;
		}
	}
};

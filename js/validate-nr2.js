(function () {
    
    // set cross browser listener methods
	var addListenerMethod = Rughster.browserAppropriateAddEventListener();
	var removeListenerMethod = Rughster.browserAppropriateRemoveEventListener();
    
    // To format placeholders after errors
    var toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    
    // DOM Selectors
    var allFields = document.querySelectorAll('#the_form input, #the_form textarea'),
    requiredFields = document.querySelectorAll('input[data-required="required"]'),
    formLoading = document.getElementById('the_load'),
    formSuccess = document.getElementById('success'),
    formError = document.getElementById('error');

    // Resets input style on focus
    for (var i = 0; i < allFields.length; i++) {
        allFields[i][addListenerMethod]('focus', function(event) {
            event.target.className = 'valid';
            event.target.placeholder = toTitleCase(event.target.name);
            }, true);
    }

    // Validates on Blur
    for(var i = 0; i < requiredFields.length; i++)
    {
        requiredFields[i][addListenerMethod]('blur', validateFields);
    }

    // Submit!
    document.getElementById('submit_form')[addListenerMethod]('click', formSubmit);
    
    function formSubmit()
	{
        formError.style.visibility = 'hidden';
		if(validateFields())
		{	
			var queryString = '';
			for(var i=0, numFormFields = allFields.length; i < numFormFields; i++)
			{
				queryString += allFields[i].name + '=' + allFields[i].value + '&';
			}
			Rughster.ajax('GET','sendmail.php?' + queryString, false, formSubmitted);
			formLoading.style.visibility = 'visible';
		}
	}
    
    function validateFields()
	{
		var isValid = true;
        for(var i = 0; i < requiredFields.length; i++)
			{
				if(requiredFields[i].value === '')
				{
					requiredFields[i].placeholder = toTitleCase(requiredFields[i].name) + ' is required';
                    requiredFields[i].className = 'invalid';
					isValid = false;
				}
                else if(requiredFields[i].name == 'email') {
                    var emailRegex = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/;
                    if (emailRegex.test(requiredFields[i].value)) {
                        requiredFields[i].className = 'valid';
                    }
                    else {
                        requiredFields[i].className = 'invalid';
                        requiredFields[i].value = '';
                        requiredFields[i].placeholder = 'Please enter a valid email address';
                        isValid = false;
                    }
                }
			}
		return isValid;
	}
    
    function formSubmitted(responseText, httpCode, error)
	{
		if(responseText == 'success')
		{
			formLoading.style.visibility = 'hidden';
			formSuccess.style.visibility = 'visible';
		}
		else
		{
			formLoading.style.visibility = 'hidden';
			formError.style.visibility = 'visible';
		}
	}
            
}());
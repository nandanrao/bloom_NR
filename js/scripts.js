(function () {

	// set cross browser listener methods
	var addListenerMethod = Rughster.browserAppropriateAddEventListener();
	var removeListenerMethod = Rughster.browserAppropriateRemoveEventListener();

	//setting up for DOM selection
	var formSection;
	var formLoading;
	var formSuccess;
	var formError;
	var requiredFields;
	var numRequired;
	var allFields;

	function init()
	{

		// DOM selectors
		var submitBtn = document.getElementById('submit_form');
		formSection = document.getElementById('the_form');
		formLoading = document.getElementById('the_load');
		formSuccess = document.getElementById('success');
		formError = document.getElementById('error');
		requiredFields = document.querySelectorAll('input[data-required="required"]');
		allFields = document.querySelectorAll('#the_form input, #the_form textarea');


		// event listeners
		submitBtn[addListenerMethod]('click', formSubmit);
		
		numRequired = requiredFields.length;

		for(var i = 0; i < numRequired; i++)
		{
			requiredFields[i][addListenerMethod]('blur', validateFields);
		}
	}
    
    // Used in error messaging
    function toTitleCase(str)
        {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

	function formSubmit()
	{
		//validate form
		if(validateFields(null))
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
	function validateFields(evt)
	{
		var isValid = true;
		if(evt)
		{
			if(evt.target.value === '')
			{
				evt.target.placeholder = toTitleCase(evt.target.name) + ' is required';
                evt.target.className = 'invalid';
				isValid = false;
			}
            else if(evt.target.name == 'email') {
                    var emailRegex = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/;
                    if (emailRegex.test(evt.target.value)) {
                        evt.target.className = 'valid';
                    }
                    else {
                        evt.target.className = 'invalid';
                        evt.target.value = '';
                        evt.target.placeholder = 'Please enter a valid email address';
                        isValid = false;
                    }
                }				
			else
			{
				evt.target.placeholder = toTitleCase(evt.target.name);
                evt.target.className = 'valid';
			}
		}
		else
		{
			for(var i = 0; i < numRequired; i++)
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
				else
				{
					requiredFields[i].placeholder = toTitleCase(requiredFields[i].name);
                    requiredFields[i].className = 'valid';
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
	init();

}());
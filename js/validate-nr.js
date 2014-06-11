(function () {
    
    // set cross browser listener methods
	var addListenerMethod = Rughster.browserAppropriateAddEventListener();
	var removeListenerMethod = Rughster.browserAppropriateRemoveEventListener();
    
    var toTitleCase = function(str)
    {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    
    var allFields = document.querySelectorAll('#the_form input, #the_form textarea');
    
    for (var i = 0; i < allFields.length; i++) {
        allFields[i][addListenerMethod]('focus', function(event) {
            event.target.className = 'valid';
            event.target.placeholder = toTitleCase(event.target.name);
            }, true);
    }
                                                       
        var validator = new FormValidator('request_demo', [{
            name: 'name',   
            rules: 'required'
        }, {
            name: 'email',
            rules: 'required|valid_email'
        }], 
            function(errors, event) {
                if (errors.length > 0) {
                    for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
                        document.getElementById(errors[i].name).className = 'invalid';
                        document.getElementById(errors[i].name).value = '';
                        document.getElementById(errors[i].name).placeholder = toTitleCase(errors[i].name) + ' is required';
                        if (errors[i].rule == 'valid_email') {
                            document.getElementById(errors[i].name).placeholder = 'Please enter a valid email address';
                        }
                    }
                }
                else {
                    var queryString = '';
                    for(var i = 0; i < allFields.length; i++)
                    {
                        queryString += allFields[i].name + '=' + allFields[i].value + '&';
                    }
                    Rughster.ajax('GET','sendmail.php?' + queryString, false, formSubmitted);
                    document.getElementById('the_load').style.visibility = 'visible';
                }
            }
        );
    
    function formSubmitted(responseText, httpCode, error)
	{
		if(responseText == 'success')
		{
			document.getElementById('the_load').style.visibility = 'hidden';
			document.getElementById('success').style.visibility = 'visible';
		}
		else
		{
			document.getElementById('the_load').style.visibility = 'hidden';
			document.getElementById('error').style.visibility = 'visible';
		}
	} 
}());
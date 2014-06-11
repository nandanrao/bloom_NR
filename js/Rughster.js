'use strict';

/***********************

Helper methods, many replace jQuery

Speed, speed, speed

***********************/

var Rughster =
{
	listType: function(list)
	{
		
	},
	addClass: function(element, classes)
	{
		var classesArray = element.className.split(' ');
		var currentlyAssigned = classesArray.indexOf(classes);
		var listOfClasses = '';
		var cleanList;

		if(currentlyAssigned === -1)
		{
			classesArray.push(classes);
		}
		for(var i=0, numClasses = classesArray.length; i< numClasses; i++)
		{
			listOfClasses += ' ';
			listOfClasses += classesArray[i];
			
		}
		cleanList = listOfClasses.trim();
		element.className = cleanList;

		return true;
	},
	removeClass: function(element, classes)
	{
		var classesArray = element.className.split(' ');
		var currentlyAssigned = classesArray.indexOf(classes);
		var listOfClasses = '';
		var cleanList;
		for(var i=0, numClasses = classesArray.length; i< numClasses; i++)
		{
			if(classesArray[i] != classes)
			{
				listOfClasses += ' ';
				listOfClasses += classesArray[i];	
			}			
		}
		cleanList = listOfClasses.trim();
		element.className = cleanList;

		return true;
	},
	browserAppropriateAddEventListener: function()
	{
		var testElement = document.createElement('a');
		if(testElement.addEventListener)
		{
			return 'addEventListener';
		}
		else if(testElement.attachEvent)
		{
			return 'attachEvent';
		}
	},
	browserAppropriateRemoveEventListener: function()
	{
		var testElement = document.createElement('a');
		if(testElement.addEventListener)
		{
			return 'removeEventListener';
		}
		else if(testElement.attachEvent)
		{
			return 'detachEvent';
		}
	},
	browserAppropriateStyleComputation: function()
	{
		var testComputed = document.createElement('span');
		
		if(window.getComputedStyle)
		{
			return 'getComputedStyle';
		}
		else
		{
			return 'currentStyle';
		}
	},
	getRelationship: function(subject, potentialRelative)
	{
		// returns the SUBJECT's relationship to the potentialRelative linearly (no cousins/aunts/uncles)
		var relationship = 'unrelated';
		var failSafe = 0;
		var currentParent = null;
		var currentPrevSibling = null;
		var currentNextSibling = null;
		if(subject == potentialRelative)
		{
			relationship = 'self';
			return relationship;
		}
		/* check if child */
		if(subject.parentElement)
		{
			currentParent = subject.parentElement;
		}
		while(currentParent && failSafe < 200)
		{
			if(currentParent == potentialRelative)
			{
				relationship = 'child';
				return relationship;
			}
			currentParent = currentParent.parentElement;

			failSafe++;
		}

		/* check if parent */
		failSafe = 0;
		if(subject.parentElement)
		{
			currentParent = subject.parentElement;
		}
		while(currentParent && failSafe < 200)
		{
			if(currentParent == subject)
			{
				relationship = 'parent';
				return relationship;
			}
			currentParent = currentParent.parentElement;

			failSafe++;
		}

		/* check if sibling */
		failSafe = 0;
		if(subject.previousElementSibling)
		{
			currentPrevSibling = subject.previousElementSibling;
		}
		while(currentPrevSibling && failSafe < 200)
		{
			if(currentPrevSibling == potentialRelative)
			{
				relationship = 'sibling';
				return relationship;
			}
			currentPrevSibling = currentPrevSibling.previousElementSibling;

			failSafe++;
		}

		/* check if sibling */
		failSafe = 0;
		if(subject.nextElementSibling)
		{
			currentNextSibling = subject.nextElementSibling;
		}
		while(currentNextSibling && failSafe < 200)
		{
			if(currentNextSibling == potentialRelative)
			{
				relationship = 'sibling';
				return relationship;
			}
			currentNextSibling = currentNextSibling.nextElementSibling;

			failSafe++;
		}
		return relationship;
	},
	trueHover: function(element, onFunction, offFunction)
	{
		element[this.browserAppropriateAddEventListener()]('mouseenter', function()
		{
			onFunction();
		});
		element[this.browserAppropriateAddEventListener()]('mouseleave', function(evt)
		{
			if(this.getRelationship(evt.toElement, element) != 'child')
			{
				offFunction();
			}
		});
	},
	trueWidth: function(element)
	{
		 var styles = window[this.browserAppropriateStyleComputation()](element);
		 return {
			totalWidth: parseFloat(styles.width),
			widthMeasurement: (styles.width.replace(parseFloat(styles.width), '')),
			padding: (parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)),
			margin: (parseFloat(styles.marginLeft) + parseFloat(styles.marginRight)),
			border: (parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth))
		 }
	},
	trueHeight: function(element)
	{
		 var styles = window[this.browserAppropriateStyleComputation()](element);
		 return {
			totalHeight: parseFloat(styles.height),
			heightMeasurement: (styles.height.replace(parseFloat(styles.height), '')),
			padding: (parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)),
			margin: (parseFloat(styles.marginLeft) + parseFloat(styles.marginBottom)),
			border: (parseFloat(styles.borderLeftWidth) + parseFloat(styles.borderRightWidth))
		 }
	},
	scrollProgress: function(elementRect, travelDistance, reachAtRatio)
	{
		var scrollProgVals = {}
		var viewHeight = window.innerHeight;	

		scrollProgVals.pctDown = Math.abs(1 - (elementRect.bottom / (viewHeight+ elementRect.height)));		
		scrollProgVals.pctToGoal = scrollProgVals.pctDown / reachAtRatio;
		scrollProgVals.pxMoved = Math.min(scrollProgVals.pctToGoal * travelDistance, travelDistance);
		
		return scrollProgVals;
	},
	ajax: function(requestMethod, url, params, callback)
	{
		var httpRequest;

		if(window.XMLHttpRequest)
		{
			httpRequest = new XMLHttpRequest();
		}
		else if(window.ActiveXObject)
		{
			try 
			{
				httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e)
			{
				try
				{
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (e) {}
			}
		}
		if (!httpRequest)
		{
			return callback(false, false, 'Browser does not support ajax requests');
		}

		httpRequest.onreadystatechange = ajaxEvent;
		
		if(requestMethod == 'POST')
		{
			httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		httpRequest.open(requestMethod, url, true);
		httpRequest.send(params);

		function ajaxEvent()
		{
			if(httpRequest.readyState === 4)
			{
				if (httpRequest.status === 200) {
					return callback(httpRequest.responseText, httpRequest.status, false);
				} else {
					return callback(false, httpRequest.status, 'Request Failed');
				}
			}

		}
	}
}
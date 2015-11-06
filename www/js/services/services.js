
var ledermodule = angular.module('leder.services', [])


ledermodule.service('Quotes', function() {
  //highlighted words into an array of quote arrays of objects
	var highlightedWords = [];
	var quoteArray = [];
	var scopeWords = [];

	return {

		getHighlightedWords: function() {
	      	return highlightedWords;
	    },

		getQuoteArray: function() {
	      	return quoteArray;
	    },

	    setHighlightedWords: function(quoteArray, sourceTitle, currentProject) {
	    	//first check if quote array exists in project
	    	if (currentProject.quotes) {
	    		//do nothing
	    	} else {
	    		//create quote attribute
	    		currentProject.quotes = [];
	    	}

	    	for (var i=0; i < quoteArray.length; i++){
	    		var object = {};
	    		var newQuoteTemp = [];
	    		for (var j=0; j < quoteArray[i].length; j++){
	    			if (j == 0) {
	    				//add starting ID
	    				object.idStart = quoteArray[i][j].id;
	    				//add source ID
	    				object.source = sourceTitle;
	    				newQuoteTemp.push(quoteArray[i][j].text);
	    			} else if (j == quoteArray[i].length -1) {
	    				newQuoteTemp.push(quoteArray[i][j].text);
	    				//add end ID
    					object.idEnd = quoteArray[i][j].id;
	    			} else {
	    				newQuoteTemp.push(quoteArray[i][j].text);
	    			}
	    		}
	    		object.text = newQuoteTemp.join(" ");
	    		currentProject.quotes.push(object);
	    	}
	    	return currentProject.quotes;
	    },

	    addListItem: function(quoteText, currentProject) {
	    	//first check if quote array exists in project
	    	if (currentProject.quotes) {
	    		//do nothing
	    	} else {
	    		//create quote attribute
	    		currentProject.quotes = [];
	    	}

    		var object = {};
    		if (quoteText.customSource){
				object.source = quoteText.customSource;
    		} else {
    			object.source = "Note to Self";
    		};
    		object.text = quoteText.customQuote;
    		object.flagged = false;
    		currentProject.quotes.unshift(object);

	    	return currentProject.quotes;
	    },

	};

});



var ledermodule = angular.module('leder.services', [])


ledermodule.service('Quotes', function() {
  //highlighted words into an array of quote arrays of objects
	var highlightedWords = [];
	var quoteArray = [];
	// var noteTitle = "";

	return {

		getHighlightedWords: function() {
	      	return highlightedWords;
	    },

		getQuoteArray: function() {
	      	return quoteArray;
	    },

	    setHighlightedWords: function(quoteArray, sourceTitle, currentQuotes) {

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
	    		currentQuotes.push(object);
	    	}
	    	return currentQuotes;
	    },

	};

});



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

	    setHighlightedWords: function(value, sourceTitle) {

	    	var newQuoteArray = [];
	    	for (var i=0; i < value.length; i++){
	    		var object = {};
	    		var newQuoteTemp = [];
	    		for (var j=0; j < value[i].length; j++){
	    			if (j == 0) {
	    				//add starting ID
	    				object.idStart = value[i][j].id;
	    				//add source ID
	    				object.source = sourceTitle;
	    				newQuoteTemp.push(value[i][j].text);
	    			} else if (j == value[i].length -1) {
	    				newQuoteTemp.push(value[i][j].text);
	    				//add end ID
    					object.idEnd = value[i][j].id;
	    			} else {
	    				newQuoteTemp.push(value[i][j].text);
	    			}
	    		}
	    		object.text = newQuoteTemp.join(" ");
	    		newQuoteArray.push(object);
	    	}
	    	return newQuoteArray;
	    },

	};

});


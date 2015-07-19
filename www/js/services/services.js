
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

	    setHighlightedWords: function(value){
	    	highlightedWords = value;
	    },

	    // setNoteTitle: function(value){
	    // 	noteTitle = value;
	    // }

	    // getNoteTitle: function(){
	    // 	return noteTitle;
	    // }

	};

});


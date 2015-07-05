angular.module('leder.editSourceController', [])

//detect gestures
.directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      $ionicGesture.on('touch', scope.onTouch, elem);
    }
  }
})


.controller('EditSourceCtrl', function($scope, Sources, Quotes, $stateParams) {


  //set variable $scope.sourceText to string of text
  $scope.sourceText = Sources.getSourceText($stateParams.ProjectId); 

  //split string of text into array of strings
  $scope.parseSourceText = function(sourceText) {
    var sourceText = sourceText.split(" ");

    //declare empty array to hold word objects
    $scope.words = [];
    //loop through array of strings and create array of objects
    for (var i = 0; i < sourceText.length; i++) {
      var obj = {};
      obj.text = sourceText[i];
      obj.isHighlighted = false; 
      obj.id = i;
      $scope.words.push(obj);
    }
    return $scope.words;
  };

  // parse source text into array 
  $scope.sourceText = $scope.parseSourceText($scope.sourceText);

  //HIGHLIGHTING FUNCTIONS

  //set two variables for first and last word IDs

  $scope.highlightMode = false;
  $scope.firstWordID = null;
  $scope.lastWordID = null;

 //function to set first and last word IDs
  $scope.onTouch = function detectTouch(e) {   

    //good practice
    e.preventDefault(); 

    //if nodename is a SPAN element
    if (e.target.nodeName == "SPAN"){

      //if user is in highlight mode, save the ID to the last word
      if ($scope.highlightMode) {
        $scope.lastWordID = e.srcElement.id;
        console.log("Last word is " + $scope.lastWordID);
        //apply highlighting 
        $scope.applyHighlight($scope.firstWordID, $scope.lastWordID);
      } 
    //if user is not in highlight mode, save the ID to the first word
      else {
        $scope.firstWordID = e.srcElement.id;

        //highlight first word
        $scope.words[$scope.firstWordID].isHighlighted = true;
        console.log($scope.words[$scope.firstWordID]);

        //ensure highlighting applies
        $scope.$apply();
        //set highlight mode to true so next touch will register as final word
        $scope.highlightMode = true;
      };

    };


  };


  $scope.applyHighlight = function highlightTest(firstWordID, lastWordID) {

    console.log("Highlighting called");

    //iterate through each object in $scope.words
    for (var i = 0; i < $scope.words.length; i++){
      //if current element is greater than the ID of the first word and less than the ID of the last word, 
      //then change isHighlighted attribute to true
      if ($scope.words[i].id >= firstWordID && $scope.words[i].id <= lastWordID){
        $scope.words[i].isHighlighted = true;
        console.log($scope.words[i].isHighlighted);
      } 
    }
    //ensure CSS highlighting reflects changed attribute
    $scope.$apply();

    //set highlight mode to false so a new touch can register
    $scope.highlightMode = false;

  };  


  //highlighted words into an array of quote arrays of objects
  $scope.highlightedWords = Quotes.getHighlightedWords(); 
  $scope.quoteArray = Quotes.getQuoteArray();


  //function to clear highlighted words
  $scope.clearHighlightedWords = function() {
    //ensure highlighted words array is empty
    $scope.highlightedWords = [];

    //iterate through array of quote arrays of objects
    for (var i = 0; i < $scope.words.length; i++){
      //if isHighlighted attribute is true, set it to false 
      if ($scope.words[i].isHighlighted){
        $scope.words[i].isHighlighted = false;
      } 
    };

  };


  //function to parse highlighted words
  $scope.parseHighlightedWords = function() {
    //ensure highlighted words array is empty
    $scope.highlightedWords = [];

    //iterate through array of quote arrays of objects
    for (var i = 0; i < $scope.words.length; i++){

      //if word is highlighted, push to array
      if ($scope.words[i].isHighlighted){
        $scope.quoteArray.push($scope.words[i]);
      } 
      //once the iteration hits a non-highlighted word, push to array if quote exists
      else if ($scope.quoteArray.length > 0) {
        $scope.highlightedWords.push($scope.quoteArray);
        //clear quoteArray to start again
        $scope.quoteArray = [];
      } else {
        //do nothing
      };

    };

    //check once more for final quote, then push to quote array
    if ($scope.quoteArray.length > 0) {
        $scope.highlightedWords.push($scope.quoteArray);
        //clear quoteArray to start again
        $scope.quoteArray = [];
    }
    //update service variable
    Quotes.setHighlightedWords($scope.highlightedWords);

  };


})
angular.module('leder.editSourceController', [])

//detect gestures
.directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      $ionicGesture.on('tap', scope.onTouch, elem);
    }
  }
})

.controller('EditSourceCtrl', function($scope, Quotes, $stateParams, EvernoteOAuth, ProjectService, $document, $ionicPopup, $timeout, $ionicPlatform, $state) {
  //set note title
  $scope.noteTitle = $stateParams.notetitle;

  //set loading icon
  $scope.loaderShown = true;

  //set buttons to disabled
  $scope.isDisabled = true;

  //get note content
  EvernoteOAuth.getSingleNoteContent($stateParams.noteguid, function(noteContent) {
    // parse source text into array; set variable $scope.sourceText to string of text 
    $scope.sourceText = $scope.parseSourceText(noteContent);
  });

  $timeout(function() {
    //check whether sample project
    if (!$stateParams.noteguid) {
      var text = "This is the content of your note. You can highlight portions of this note to include as quotes in your outline. To highlight, tap the first word and last word of the selection of text you wish to copy. (Don't drag your finger across the note, or press and hold a single word; just tap the first and last words.) Tap any highlighted word to remove the highlight. Repeat this process as much as you want. When you are finished, hit the 'Save' button below. Go back to your project and select the 'Outline' tab to see your newly highlighted quote.";
      $scope.sourceText = $scope.parseSourceText(text);
    } 

  });

  //get project; set up asynchronous project promise
  var projectPromise = ProjectService.getProject($stateParams.ProjectId);
 
  //get all project records from the database.
  projectPromise.then(function(project) {
    $scope.project = project;
  });

  //setting up markup global variables 
  $scope.showingMarkup = false;
  $scope.changeMarkupText = "Show";

  //split string of text into array of strings
  $scope.parseSourceText = function(sourceText) {
    //split by white space
    var sourceText = sourceText.split(" ");

    //declare empty array to hold word objects
    $scope.words = [];

    //loop through array of strings and create array of objects
    for (var i = 0; i < sourceText.length; i++) {
      var obj = {};
      obj.text = sourceText[i];
      obj.isHighlighted = false; 
      obj.wasHighlighted = false; 
      obj.isFirstWord = false;
      obj.id = i;
      $scope.words.push(obj);
    }

    //turn loading icon off
    $scope.loaderShown = false;

    //make sure this digest updates
    $scope.$digest($scope.loaderShown);
    
    return $scope.words;
  };

//HIGHLIGHTING FUNCTIONS

//set three variables for highlight mode, first word ID, last word ID
$scope.highlightMode = false;
$scope.firstWordID = null;
$scope.lastWordID = null;

//function to set first and last word IDs
$scope.onTouch = function detectTouch(e) {   

  //good practice
  e.preventDefault(); 

  //if nodename is a SPAN element
  if (e.target.nodeName == "SPAN"){

    //turn off highlighting if highlighting is on
    if ($scope.words[e.srcElement.id].isHighlighted) {
      //turn highlighting off
      $scope.words[e.srcElement.id].isHighlighted = false;
      //ensure highlighting applies
      $scope.$digest();
    } 

   //if user is in highlight mode, save the ID to the last word
    else if ($scope.highlightMode) {

      $scope.lastWordID = e.srcElement.id;
      //apply highlighting 
      $scope.applyHighlight($scope.firstWordID, $scope.lastWordID);
    } 
  //if user is not in highlight mode, save the ID to the first word
    else {

      $scope.firstWordID = e.srcElement.id;

      //set first word setting on
      $scope.words[$scope.firstWordID].isFirstWord = true;

      //highlight first word
      $scope.words[$scope.firstWordID].isHighlighted = true;
      //ensure highlighting applies
      $scope.$digest();
      //set highlight mode to true so next touch will register as final word

      $scope.highlightMode = true;
    };
  };
};
 

$scope.applyHighlight = function highlightTest(firstWordID, lastWordID) {
  //iterate through each object in $scope.words
  for (var i = 0; i < $scope.words.length; i++){
    //if current element is greater than the ID of the first word and less than the ID of the last word, 
    //then change isHighlighted attribute to true
    if ($scope.words[i].id >= firstWordID && $scope.words[i].id <= lastWordID){
      $scope.words[i].isHighlighted = true;
      //set first word setting off
      $scope.words[$scope.firstWordID].isFirstWord = false;
    } 
  }

  //allow quote to be saved and cleared
  $scope.isDisabled = false;

  //ensure CSS highlighting reflects changed attribute
  $scope.$digest();

  //set highlight mode to false so a new touch can register
  $scope.highlightMode = false;

};  

//highlighted words into an array of quote arrays of objects
$scope.highlightedWords = Quotes.getHighlightedWords(); 
$scope.quoteArray = Quotes.getQuoteArray();

//function to parse highlighted words
$scope.parseHighlightedWords = function() {
  //ensure highlighted words array is empty
  $scope.highlightedWords = [];
  $scope.quoteArray = [];

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
  $scope.highlightedWords = Quotes.setHighlightedWords($scope.highlightedWords, $scope.noteTitle, $scope.project);

  //update project object with new quote array
  ProjectService.updateProjectObjectWithQuotes($stateParams.ProjectId,$stateParams.noteguid, $scope.highlightedWords)
  .then(function(updatedProject){
    $scope.project = updatedProject;
    $scope.showQuoteConfirmation();  
    $scope.clearHighlightedWords();
  });
};

// Triggered on a button click, or some other target
$scope.showQuoteConfirmation = function(content) {
   var alertPopup = $ionicPopup.alert({
     title: 'Your Selection Has Been Saved',
     template: 'The highlighted selection has been successfully added to your outline.'
   });
   alertPopup.then(function(res) {
     //success
    });
 };

//function to show highlighted words
$scope.changeMarkup = function() {
    if ($scope.showingMarkup){
       $scope.clearMarkup();
    } else {
       $scope.showMarkup();
    }
};

//function to clear markup
$scope.clearMarkup = function() {
 for (var i = 0; i < $scope.words.length; i++){
      // change isHighlighted attribute to false
        $scope.words[i].wasHighlighted = false;
  } 
     
  $scope.showingMarkup = false;
  $scope.changeMarkupText = "Show";

};
  
//function to show highlighted words
$scope.showMarkup = function() {
    if ($scope.project.quotes) {
      for (var i=0; i<$scope.project.quotes.length; i++){
          if ($scope.project.quotes[i].source == $scope.noteTitle) {
            var startID = $scope.project.quotes[i].idStart;
            var endID = $scope.project.quotes[i].idEnd;
            $scope.applyPreviousHighlighting(startID, endID);
          }
       }
    } else {
      //do nothing
    }
};

$scope.applyPreviousHighlighting = function(startID, endID){
  for (var i = 0; i < $scope.words.length; i++){
      //if current element is greater than the ID of the first word and less than the ID of the last word, 
      //then change isHighlighted attribute to true
      if ($scope.words[i].id >= startID && $scope.words[i].id <= endID){
        //turn on past highlighting attribute
        $scope.words[i].wasHighlighted = true;
      } 
    }
  $scope.showingMarkup = true;  
  $scope.changeMarkupText = "Hide";
};

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
  
  //set buttons to disabled again
  $scope.isDisabled = true;
};

})
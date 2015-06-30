angular.module('leder.controllers', [])

//detect gestures
.directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      $ionicGesture.on('touch', scope.onTouch, elem);
    }
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Notes, $stateParams, Evernote) {


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    Evernote.loginWithEvernote();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.editModal.remove();
  });

  // Execute action on hide modal
  $scope.$on('editModal.hidden', function() {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('editModal.removed', function() {
    // Execute action
  });


})

.controller('ProjectsCtrl', function($scope, Notes, $stateParams) {
  $scope.notes = Notes.all();

})

.controller('ProjectPageCtrl', function($scope, Notes, $stateParams) {
  //get project ID and set in url
  $scope.projectID = $stateParams.ProjectId;

})

.controller('NotesCtrl', function($scope, Notes, $stateParams, $ionicModal) {
  $scope.notes = Notes.getSourcesForProject($stateParams.ProjectId); 

})

.controller('OutlineCtrl', function($scope, Notes, Quotes, $stateParams, $ionicListDelegate) {
 //highlighted words into an array of quote arrays of objects
  $scope.highlightedWords = Quotes.getHighlightedWords(); 
  $scope.quoteArray = Quotes.getQuoteArray();

  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;



  $scope.reorderItem = function(item, fromIndex, toIndex) {
      //Move the item in the array
    $scope.highlightedWords.splice(fromIndex, 1);
    $scope.highlightedWords.splice(toIndex, 0, item);
  };

  $scope.delete = function(item) {
    $scope.highlightedWords.splice($scope.highlightedWords.indexOf(item), 1);
    //close swipe button
    $ionicListDelegate.$getByHandle('outline-list').closeOptionButtons();

  };

})

.controller('EditNoteCtrl', function($scope, Notes, Quotes, $stateParams) {

  //populate edit screen with source text
  $scope.noteText = Notes.getNoteText($stateParams.ProjectId); 

  //function to split string for display
  $scope.parseNoteText = function(noteText) {
    //split the string into individual words
    var noteText = noteText.split(" ");

    //empty array to hold my word objects
    $scope.words = [];

    //function to loop through string array and create an array of objects
    for (var i = 0; i < noteText.length; i++) {
      var obj = {};
      obj.text = noteText[i];
      obj.isHighlighted = false; 
      obj.id = i;
      $scope.words.push(obj);
    }
    return $scope.words;
  };

  // parse source text into array 
  $scope.noteText = $scope.parseNoteText($scope.noteText);

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

    //iterate through object array.
    for (var i = 0; i < $scope.words.length; i++){
      //if current element is greater than first word ID and less than last word ID, then change isHighlighted to true
      if ($scope.words[i].id >= firstWordID && $scope.words[i].id <= lastWordID){
        $scope.words[i].isHighlighted = true;
        console.log($scope.words[i].isHighlighted);
      }; 
    };
    //ensure highlighting applies
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

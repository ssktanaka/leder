angular.module('leder.editSourceController', [])

//detect gestures
.directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      $ionicGesture.on('tap', scope.onTouch, elem);
      $ionicGesture.on('swiperight', scope.onSwipeRight, elem);
    }
  }
})


.controller('EditSourceCtrl', function($scope, Quotes, $stateParams, EvernoteOAuth, ProjectService, $document) {
  //set note title
  $scope.noteTitle = $stateParams.notetitle;
  //get note content
  EvernoteOAuth.getSingleNoteContent($stateParams.noteguid, function(noteContent) {
      // parse source text into array 
      //set variable $scope.sourceText to string of text
    $scope.sourceText = $scope.parseSourceText(noteContent);
  });


  //get project

  //set up asynchronous project promise
  var projectPromise = ProjectService.getProject($stateParams.ProjectId);
  // Get all project records from the database.
  projectPromise.then(function(project) {
    $scope.project = project;
    //apply previous highlighting
    // $scope.findStartEnd(project);

  });


  // $scope.findStartEnd = function(project) {
  //   console.log(project);
  //   for (var i=0; i<project.quotes.length; i++){
  //     if (project.quotes[i].source == $scope.noteTitle) {
  //       console.log("Quote..." + project.quotes[i].source + " " + project.quotes[i].text )
  //       var startID = project.quotes[i].idStart;
  //       var endID = project.quotes[i].idEnd;
  //       $scope.applyPreviousHighlighting(startID, endID);
  //     }
  //   }
  // };

  // $scope.applyPreviousHighlighting = function(startID, endID){

  //   for (var i = 0; i < $scope.words.length; i++){
  //       //if current element is greater than the ID of the first word and less than the ID of the last word, 
  //       //then change wasHighlighted attribute to true
  //       if ($scope.words[i].id >= startID && $scope.words[i].id <= endID){
  //         $scope.words[i].wasHighlighted = true;
  //       } 
  //     }
  //     //ensure CSS highlighting reflects changed attribute
  //     $scope.$apply();    

  // };

  //split string of text into array of strings
  $scope.parseSourceText = function(sourceText) {

    //split by new line or comma
    // var sourceText = sourceText.split(/[\n ]+/);
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
      // obj.isPageBreak = false;
      obj.id = i;
      $scope.words.push(obj);
    }

    return $scope.words;
  };



// //array holding paragraph breaks
$scope.paragraphBreaks = [];


// $scope.clearBreaks = function(){
//   // div.innerHTML.replace(/\&lt;br\&gt;/gi,"\n").replace(/(&lt;([^&gt;]+)&gt;)/gi, "")
//   console.log($scope.paragraphBreaks);
//   for (var i = 0; i<$scope.paragraphBreaks.length; i++){
//     console.log($scope.paragraphBreaks[i]);
//     $scope.paragraphBreaks[i].splice(0, 2);
//     console.log($scope.paragraphBreaks[i]);
//   }
//   $scope().apply();
// }
//set up Swipe Right to paragraph break, Swipe Left to collapse


$scope.onSwipeRight = function swipingRight(event) {
  if (event.target.nodeName == "SPAN"){
      console.log("swiping right");
      // $scope.paragraphBreaks.push(event.target.id);
      // $scope.insertBreaks($scope.paragraphBreaks);
      event.target.innerHTML = "<br/><br/>" + event.target.innerHTML;
      //store within angular element
     // $scope.paragraphBreaks.push(angular.element( event.target.innerHTML));
     // $scope.words[event.target.id].isPageBreak = true;

     //  //ensure highlighting applies
     //  $scope.$apply();
      //get current object
      // $scope.words[event.target.id])
   } 
}


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

      //turn off highlighting if highlighting is on
      if ($scope.words[e.srcElement.id].isHighlighted) {
        //turn highlighting off
        $scope.words[e.srcElement.id].isHighlighted = false;
        //ensure highlighting applies
        $scope.$apply();
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
        $scope.$apply();
        //set highlight mode to true so next touch will register as final word

        $scope.highlightMode = true;
      };

    };


  };

 

  $scope.applyHighlight = function highlightTest(firstWordID, lastWordID) {
    console.log("firstWordID")

    console.log(firstWordID)
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

  //function to show highlighted words
  $scope.showHighlightedWords = function() {
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
  };



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
    });
 
  };


})
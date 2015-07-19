angular.module('leder.outlineController', [])

.controller('OutlineCtrl', function($scope, Quotes, $stateParams, $ionicListDelegate, EvernoteOAuth, $rootScope, $q, ProjectService) {
   console.log($stateParams);


  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  ProjectService.getProject($stateParams.ProjectId).then(function(project) {
    $scope.project = project;

  //highlighted words into an array of quote arrays of objects
    $scope.highlightedWords = $scope.project.quotes; 
    // $scope.quoteArray = Quotes.getQuoteArray();
    console.log($scope.highlightedWords);


  });

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




 // //highlighted words into an array of quote arrays of objects
 //  $scope.highlightedWords = Quotes.getHighlightedWords(); 
 //  $scope.quoteArray = Quotes.getQuoteArray();

 //  $scope.shouldShowReorder = false;
 //  $scope.listCanSwipe = true;




 //  $scope.reorderItem = function(item, fromIndex, toIndex) {
 //      //Move the item in the array
 //    $scope.highlightedWords.splice(fromIndex, 1);
 //    $scope.highlightedWords.splice(toIndex, 0, item);
 //  };

 //  $scope.delete = function(item) {
 //    $scope.highlightedWords.splice($scope.highlightedWords.indexOf(item), 1);
 //    //close swipe button
 //    $ionicListDelegate.$getByHandle('outline-list').closeOptionButtons();

 //  };

})
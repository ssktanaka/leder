angular.module('leder.outlineController', [])

.controller('OutlineCtrl', function($scope, Sources, Quotes, $stateParams, $ionicListDelegate, EvernoteOAuth, $rootScope, $q) {
 
  // console.log($scope.noteStore);
  console.log('calling getNoteList from outside')
  $scope.allNotes = EvernoteOAuth.getAllNotes();
  console.log($scope.allNotes);

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
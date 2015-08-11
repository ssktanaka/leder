angular.module('leder.outlineController', [])

.controller('OutlineCtrl', function($scope, Quotes, $stateParams, $ionicListDelegate, EvernoteOAuth, $rootScope, $q, ProjectService) {



  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = true;

  ProjectService.getProject($stateParams.ProjectId).then(function(project) {
    $scope.project = project;
    //highlighted words into an array of quote arrays of objects
    $scope.highlightedWords = $scope.project.quotes; 
    // $scope.quoteArray = Quotes.getQuoteArray();
    $scope.$apply();

  });

  $scope.reorderItem = function(item, fromIndex, toIndex) {
      //Move the item in the array
    $scope.highlightedWords.splice(fromIndex, 1);
    $scope.highlightedWords.splice(toIndex, 0, item);

  };

  $scope.delete = function(item) {
    $scope.highlightedWords.splice($scope.highlightedWords.indexOf(item), 1);
  };


  $scope.saveProject = function(highlightedWords) {
    //update project object with new array
    ProjectService.updateProjectObjectWithQuotes($stateParams.ProjectId, $stateParams.noteguid, highlightedWords);
  };

  $scope.exportProject = function(highlightedWords) {
    //update project object with new array
    $scope.saveProject(highlightedWords);
    EvernoteOAuth.exportNote(highlightedWords, $scope.project.title); 
  };

  $scope.isFormInvalid = function(){
    return this.form.$invalid;
  };

  $scope.addListItem = function(quote){
    Quotes.addListItem(quote.input, $scope.project);
    //clear quote
    this.customQuote = null;
  }
})
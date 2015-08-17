angular.module('leder.outlineController', [])

.controller('OutlineCtrl', function($scope, Quotes, $stateParams, $ionicListDelegate, EvernoteOAuth, $rootScope, $q, ProjectService, $ionicPopup, $timeout) {



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
    //call show confirmationpopup
    $scope.showExportConfirmation();
  };

  // Triggered on a button click, or some other target
  $scope.showExportConfirmation = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Success!',
       template: 'Your outline has been exported to your Evernote account.'
     });
     alertPopup.then(function(res) {
       //success
      });
   };



  $scope.isFormInvalid = function(){
    return this.form.$invalid;
  };

  $scope.addListItem = function(quote){
    Quotes.addListItem(quote.input, $scope.project);
    //clear quote
    this.customQuote = null;
  }

  $scope.addListItemPopup = function() {
    $scope.data = {}
     //additem
    var listPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="customQuote">',
      title: 'Add a Custom Quote',
      subTitle: 'Whatever you write will be added to the outline',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.customQuote) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              console.log("Running");
              console.log($scope.customQuote);
              $scope.addListItem($scope.customQuote);
              return $scope.customQuote;
            }
          }
        }
      ]
    });
    listPopup.then(function(res) {
      console.log('Tapped!', res);
    });
    $timeout(function() {
       listPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
 };

})
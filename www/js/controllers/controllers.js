angular.module('leder.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout, Sources, $stateParams, Evernote) {


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
  $scope.accessEvernote = function() {
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




.controller('AuthCtrl', function($scope, Evernote){
    console.log('in auth ctrl, yo DOES THIS EVEN DO ANYTHING', $scope)
})



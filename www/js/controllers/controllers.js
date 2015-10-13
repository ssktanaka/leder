angular.module('leder.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $stateParams, EvernoteOAuth, $ionicPopup, $timeout) {

  
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

  $scope.determineText = function(){
      if (EvernoteOAuth.checkLogin()){
        $scope.loggedIn = true;
        $scope.evernoteStatus = "You are connected to Evernote.";
      } else {
        $scope.loggedIn = false;
        $scope.evernoteStatus = "You are not connected to Evernote.";
      }
  };


  // Perform the login action when the user submits the login form
  $scope.accessEvernote = function() {
    EvernoteOAuth.loginWithEvernote();

  };

  $scope.logoutEvernote = function() {

    EvernoteOAuth.logoutWithEvernote();

    $scope.confirmLogout();
    
  };

  // Confirm logged out
  $scope.confirmLogout = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Logged Out',
       template: 'You have been logged out of Evernote. Please reconnect to access your notes.'
     });
     alertPopup.then(function(res) {
       $scope.determineText();
      });
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

  $scope.largeTextChange = function(value){
    if (value == true) {
      $scope.largeText = true;
    } else if (value == false) {
      $scope.largeText = false;
    };
  };


})




// .controller('AuthCtrl', function($scope, EvernoteOAuth){
//     console.log('in auth ctrl, yo DOES THIS EVEN DO ANYTHING', $scope)
// })



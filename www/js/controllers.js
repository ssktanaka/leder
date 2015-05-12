angular.module('leder.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProjectsCtrl', function($scope) {
  $scope.projects = [
    { title: 'Maya Angelou', id: 1 },
    { title: 'Downtown Crossing', id: 2 },
    { title: 'Penthouses', id: 3 },
    { title: 'Lucky Numbers', id: 4 },
    { title: 'Luxury Auctions', id: 5 },
    { title: 'Grammar', id: 6 }
  ];
})

.controller('OutlineCtrl', function($scope) {
  //nothing yet
})

.controller('ProjectCtrl', function($scope, Notes) {
    $scope.notes = Notes.all();
    $scope.remove = function(note) {
      Notes.remove(note);
    }
})

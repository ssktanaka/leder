angular.module('leder.introController', [])

.controller('IntroCtrl', function($scope, $state, $ionicHistory, $ionicViewService, $localstorage) {
 
  $scope.navigateHome = function() {

  	$localstorage.set('hasVisited', true);	
     console.log("Person has visited");

    $state.transitionTo('app.projects');
	$ionicHistory.nextViewOptions({
	   disableBack: true
	});

	

  };

})



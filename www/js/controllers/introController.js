angular.module('leder.introController', [])

.controller('IntroCtrl', function($scope, $state, $ionicHistory, $ionicViewService, $localstorage) {
 
  $scope.navigateHome = function() {
    $state.transitionTo('app.projects');
	$ionicHistory.nextViewOptions({
	   disableBack: true
	});

	$localstorage.set('repeat_visitor', true);	
     console.log("repeat visitor is true");

  };

})



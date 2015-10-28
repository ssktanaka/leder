angular.module('leder.introController', [])

.controller('IntroCtrl', function($scope, $state, $ionicHistory, $localstorage) {
 
	$ionicHistory.nextViewOptions({
	   disableBack: true
	});

	$scope.startApp = function() {
		$state.go('app.projects');
		// Set a flag that we finished the tutorial
		$localstorage.set('didTutorial', true);
	};	
})



angular.module('leder.projectPageController', [])


.controller('ProjectPageCtrl', function($scope, Sources, $stateParams, EvernoteOAuth, $ionicPopup, $timeout, $state) {


  $scope.checkLogin = function() {
	//check if loggedin
	if (EvernoteOAuth.checkLogin()){
		console.log("Success");
    //get project ID and set in url
		$state.go('app.projectSources', { ProjectId: $stateParams.ProjectId});
	} else {
		$scope.showAlert();
	}
  };

 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Need Evernote Access',
     template: 'Leder needs access to your Evernote account in order to add notes. Login using the lefthand menu.'
   });
   alertPopup.then(function(res) {
     console.log('Failed');
   });
 };

})
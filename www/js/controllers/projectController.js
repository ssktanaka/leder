angular.module('leder.projectController', [])


.controller('ProjectsCtrl', function($scope, Sources, $stateParams, $ionicPopup, $timeout) {
  $scope.sources = Sources.all();
 
  $scope.showPopup = function() {
  	  $scope.data = {}
	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="text" ng-model="data.wifi">',
	    title: 'Create New Project',
	    subTitle: 'Enter a name for this project.',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancel' },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data.wifi) {
	            //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
	            return $scope.data.wifi;
	          }
	        }
	      }
	    ]
	  });
	  myPopup.then(function(res) {
	    console.log('Tapped!', res);
	  });
	  $timeout(function() {
	     myPopup.close(); //close the popup after 3 seconds for some reason
	  }, 3000);
	 };

})
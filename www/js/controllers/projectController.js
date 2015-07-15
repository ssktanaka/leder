angular.module('leder.projectController', [])


.controller('ProjectsCtrl', function($scope, Sources, $stateParams, $ionicPopup, $timeout, ProjectService) {
  // $scope.sources = Sources.all();


    // Get all project records from the database.
	ProjectService.getAllProjects().then(function(projects) {
		 $scope.projects = projects;

	});


  //get project name from user
  $scope.showPopup = function() {
  	  $scope.data = {}
	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="text" ng-model="data.project">',
	    title: 'Create New Project',
	    subTitle: 'Enter a name for this project.',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancel' },
	      {
	        text: '<b>Save</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data.project) {
	            //don't allow the user to close unless he enters project name
	            e.preventDefault();
	          } else {
	            return $scope.data.project;
	          }
	        }
	      }
	    ]
	  });
	  myPopup.then(function(res) {
	  	//res the project name
	  	ProjectService.addProject(res);
	    console.log('Tapped!', res);
	  });
	 };


   // $scope.getProjects = function() {
		 //    // Get all project records from the database.
	  //   ProjectService.getAllProjects().then(function(projects) {
	  //       $scope.projects = projects;
	  //   });
   // };

   $scope.deleteProject = function(project) {
		console.log(project);

        ProjectService.deleteProject(project);           
   };
	
})
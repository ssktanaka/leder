angular.module('leder.projectController', [])


.controller('ProjectsCtrl', function($scope, $stateParams, $ionicPopup, $timeout, $state, $ionicModal, ProjectService, EvernoteOAuth, $localstorage) {

	// Get all project records from the database.
	ProjectService.getAllProjects().then(function(projects) {
		$scope.projects = projects;
	});

	//get project name from user
	$scope.showPopup = function() {
		$scope.data = {}
	  	// An elaborate, custom popup
	    var myPopup = $ionicPopup.show({
		    template: '<input type="text" ng-model="data.project" autofocus>',
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
		            //don't allow the user to close unless project name is entered
		            e.preventDefault();
		          } else {
		            return $scope.data.project;
		          }
		        }
		      }
		    ]
	    });
	    myPopup.then(function(newProject) {
		  	//if project name exists, add it to the database
		  	if (newProject) {
			  	//res the project name
			  	ProjectService.addProject(newProject);
		  	}
	    });
	};

	$scope.showSettings = function() {
	    //open source note modal
	    $scope.settingsModal.show();  
	    $scope.determineText(); 
	};

	// Create the edit note modal that we will use later
	$ionicModal.fromTemplateUrl('templates/settings.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	    }).then(function(modal) {
	    $scope.settingsModal = modal;
	});

	//close modal
	$scope.closeSettings = function() {
	    $scope.settingsModal.hide();
	};

	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
	    $scope.settingsModal.remove();
	});

	// Execute action on hide modal
	$scope.$on('settingsModal.hidden', function() {
	    // Execute action
	});

	// Execute action on remove modal
	$scope.$on('settingsModal.removed', function() {
	    // Execute action
	});

	$scope.deleteProject = function(project) {
	    ProjectService.deleteProject(project);           
	};

	$scope.toIntro = function() {
      $scope.closeSettings();
      $localstorage.set('didTutorial', false);
      $state.go('app.intro');
      ProjectService.addFirstProject("Hi, I'm A Project");
    };
	
})

var ledermodule = angular.module('leder.onboardService', [])


ledermodule.service('OnboardService', function($localstorage, $state, ProjectService) {
  	//put vars here

	return {

		checkFirstTime: function() {
	      	  //if first time
		      var value = $localstorage.get('hasVisited');
		      console.log("have we visited?");
		      console.log(value);
			  if(value) {
			      console.log("I'm an oldie");
			      $urlRouterProvider.otherwise('/projects');  //if not first time go to sign in view.
			      // $state.go('app.projects'); //go to sign up view.
			  } else {
			       $urlRouterProvider.otherwise('/intro');  //if not first time go to sign in view.
			      //add starter project

			      console.log("I'm a newbie");
			      // ProjectService.addFirstProject("I'm Your First Project");
			      
			  };

	      	return;
	    },

	};

});


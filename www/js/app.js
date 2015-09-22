// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('leder', ['ionic', 'leder.controllers', 'leder.editSourceController', 'leder.projectController', 'leder.projectPageController', 'leder.outlineController', 'leder.services', 'leder.evernoteService', 'leder.projectService', 'ionic.utils'])


.run(function($ionicPlatform, $localstorage, EvernoteOAuth, ProjectService) {
   //initialize NoteStore
  EvernoteOAuth.initializeNoteStore();

  //initialize database
  ProjectService.initDB();

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      // StatusBar.styleDefault();

      $cordovaStatusBar.style(1) //Light

    }
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html"
      }
    }
  })

  .state('app.oauth', {
    url: "/oauth",
    views: {
      'menuContent': {
        templateUrl: "templates/oauth.html",
        controller: 'AuthCtrl'
      }
    }
  })

    .state('app.projects', {
      url: "/projects",
      views: {
        'menuContent': {
          templateUrl: "templates/projects.html",
          controller: 'ProjectsCtrl'
        }
      }
    })

  .state('app.projectPage', {
    url: "/projects/:ProjectId/projectpage",
    views: {
      'menuContent': {
        templateUrl: "templates/projectpage.html",
        controller: 'ProjectPageCtrl',
      }
    }
  })

   .state('app.projectOutline', {
      url: "/projects/:ProjectId/projectpage/outline",
      views: {
        'menuContent': {
          templateUrl: "templates/outline.html",
          controller: 'OutlineCtrl'
        }
      }
    })

   .state('app.projectEditSource', {
      url: "/projects/:ProjectId/projectpage/:noteguid/:notetitle/editsource",
      views: {
        'menuContent': {
          templateUrl: "templates/editsource.html",
          controller: 'EditSourceCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/projects');
});

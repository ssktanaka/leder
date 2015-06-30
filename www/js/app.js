// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('leder', ['ionic', 'leder.controllers', 'leder.services'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })

  .state('app.oauth', {
    url: "/oauth",
    views: {
      'menuContent': {
        templateUrl: "templates/gotOAuth.html"
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

   .state('app.projectNotes', {
      url: "/projects/:ProjectId/projectpage/notes",
      views: {
        'menuContent': {
          templateUrl: "templates/notes.html",
          controller: 'NotesCtrl'
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

   .state('app.projectEditNotes', {
      url: "/projects/:ProjectId/projectpage/notes/editnotes",
      views: {
        'menuContent': {
          templateUrl: "templates/editnote.html",
          controller: 'EditNoteCtrl'
        }
      }
    })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/projects');
});

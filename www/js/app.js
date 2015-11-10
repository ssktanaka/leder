// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('leder', ['ionic', 'ngCordova', 'leder.controllers', 'leder.editSourceController', 'leder.projectController', 'leder.projectPageController', 'leder.outlineController', 'leder.introController', 'leder.services', 'leder.evernoteService', 'leder.projectService', 'ionic.utils', 'ngIOS9UIWebViewPatch'])



.run(function($ionicPlatform, $localstorage, EvernoteOAuth, ProjectService, $ionicPopup, $timeout, $state) {
  //initialize NoteStore
  EvernoteOAuth.initializeNoteStore();

  //initialize database
  ProjectService.initDB();

  //show user intro if hasn't seen it
  var didTutorial = $localstorage.get('didTutorial');
  if(didTutorial) {
      $state.go('app.projects');
  } else {
      $state.go('app.intro');
      ProjectService.addFirstProject("Hi, I'm A Project");
  };



  var offline = false;

  //check when device goes offline
  document.addEventListener("offline", onOffline, false);

  function onOffline() {
      $ionicPopup.alert({
          title: "Turn Off Airplane Mode or Use Wi-Fi to Access Data",
          // content: "The internet is disconnected on your device."
      })
      .then(function(result) {
          offline = true;
      });
  };


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      $cordovaStatusBar.style(1) //Light
    };


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

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "templates/settings.html"
      }
    }
  })

  .state('app.intro', {
    url: "/",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
        controller: 'IntroCtrl'
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
  $urlRouterProvider.otherwise('/app/projects/');
});


//stop page flicker
angular.module('ngIOS9UIWebViewPatch', ['ng']).config(['$provide', function($provide) {
  'use strict';

  $provide.decorator('$browser', ['$delegate', '$window', function($delegate, $window) {

    if (isIOS9UIWebView($window.navigator.userAgent)) {
      return applyIOS9Shim($delegate);
    }

    return $delegate;

    function isIOS9UIWebView(userAgent) {
      return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
    }

    function applyIOS9Shim(browser) {
      var pendingLocationUrl = null;
      var originalUrlFn= browser.url;

      browser.url = function() {
        if (arguments.length) {
          pendingLocationUrl = arguments[0];
          return originalUrlFn.apply(browser, arguments);
        }

        return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
      };

      window.addEventListener('popstate', clearPendingLocationUrl, false);
      window.addEventListener('hashchange', clearPendingLocationUrl, false);

      function clearPendingLocationUrl() {
        pendingLocationUrl = null;
      }

      return browser;
    }
  }]);
}]);

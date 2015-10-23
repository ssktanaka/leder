angular.module('leder.outlineController', [])

.controller('OutlineCtrl', function($scope, Quotes, $stateParams, $ionicListDelegate, EvernoteOAuth, $rootScope, $q, ProjectService, $ionicPopup, $timeout, $ionicActionSheet, $cordovaClipboard) {

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = true;

  //set blank state
  $scope.outlineBlankState = true;

  $scope.quoteText = "Edit";

  ProjectService.getProject($stateParams.ProjectId).then(function(project) {
    $scope.project = project;

    //highlighted words into an array of quote arrays of objects
    $scope.highlightedWords = $scope.project.quotes; 

    //check if blank state should be included
    $scope.checkBlankState();    
  });

  $scope.checkBlankState = function() {
    //check if blank state should be included
    if ($scope.project.quotes.length > 0){
      $scope.outlineBlankState = false;
      //update blank slate status
      $scope.$digest();
    } else {
      $scope.outlineBlankState = true;
    };
  };

  $scope.reorderItem = function(item, fromIndex, toIndex) {
    //Move the item in the array
    $scope.highlightedWords.splice(fromIndex, 1);
    $scope.highlightedWords.splice(toIndex, 0, item);
    $scope.saveProject($scope.highlightedWords);
  };

  $scope.showDelete = function(item) {
    $scope.shouldShowDelete = !$scope.shouldShowDelete;
    $scope.shouldShowReorder = !$scope.shouldShowReorder;
    if ($scope.shouldShowReorder) {
      $scope.quoteText = "Edit";
    } else {
      $scope.quoteText = "Done";
    }
  };

  $scope.delete = function(item) {
    $scope.highlightedWords.splice($scope.highlightedWords.indexOf(item), 1);
    $scope.saveProject($scope.highlightedWords);
  };

  $scope.saveProject = function(highlightedWords) {
    //update project object with new array
    console.log("updating...");
    ProjectService.updateProjectObjectWithQuotes($stateParams.ProjectId, $stateParams.noteguid, highlightedWords).then(function(project) {
      //check if blank state should be included
      $scope.checkBlankState();
    });
  };

  $scope.exportProject = function(highlightedWords) {
    //update project object with new array
    $scope.saveProject(highlightedWords);

    EvernoteOAuth.exportNote(highlightedWords, $scope.project.title, function(err, result) {
      if (err) {
        $scope.showExportFail();
      } else {
        $scope.showExportConfirmation();
      }
    });
  };

  // Triggered on a button click, or some other target
  $scope.showExportConfirmation = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Success!',
       template: 'Your outline has been exported to your Evernote account.'
       });
       alertPopup.then(function(res) {
       //success
      });
   };

  // Triggered on a button click, or some other target
  $scope.showExportFail = function() {
     var alertPopup = $ionicPopup.alert({
       title: "Something's Wrong",
       template: 'We were unable to export your outline to Evernote. Check your internet connection and try again.'
       });
       alertPopup.then(function(res) {
       //success
      });
   };


  $scope.addListItem = function(quote){
    Quotes.addListItem(quote, $scope.project);
    $scope.saveProject($scope.highlightedWords);
    //clear quote
    this.customQuote = null;
  };

  $scope.addListItemPopup = function() {
    $scope.data = {}
     //additem

    var listPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.customSource" placeholder="Note to Self"></br><input type="text" ng-model="data.customQuote" autofocus>',
      title: 'Add a Custom Quote',
      subTitle: 'Whatever you write will be added to the outline.',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.customQuote) {
              //don't allow the user to close unless he enters something
              e.preventDefault();
            } else {
              $scope.addListItem($scope.data);
              return $scope.data.customQuote;
            }
          }
        }
      ]
    });
    listPopup.then(function(res) {
          console.log('Tapped!', res);       
      });
 };

  $scope.showActionSheet = function(item) {
     // Show the action sheet
     $scope.markup = "lala";
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: '<i class="ion-flag royal"></i>' },
         { text: 'Rename' },
         { text: 'Copy Text'},
       ],
       titleText: 'Quote Titled "' + item.source + '"',
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
          },
       buttonClicked: function(index) {
          //if flag or unflag quote is selected
          if (index == 0) {
            item.flagged = !item.flagged;

          } 
          //if rename is selected
          else if (index == 1) {
            //call function rename quote
            $scope.renameQuote(item);
          }
          //if copy text is selected
          else if (index == 2) {
            //copy text
           $scope.copyText(item.source + ": " + item.text);
          };
          //update database
          $scope.saveProject($scope.highlightedWords);
          return true;
       }
     });
  };

  $scope.renameQuote = function(item) {
      $scope.data = {}

      var renamePopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.customQuote" autofocus>',
        title: 'Rename Quote Title',
        subTitle: 'Write a new title to replace "' + item.source + '."',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Rename</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.customQuote) {
                //don't allow the user to close unless he enters something
                e.preventDefault();
              } else {
                item.source = $scope.data.customQuote;
                //update database
                $scope.saveProject($scope.highlightedWords);
                return true;
              }
            }
          }
        ]
      });
      renamePopup.then(function(res) {
            console.log('Tapped!', res);       
        });
   };

  $scope.copyText = function(value) {
      $cordovaClipboard.copy(value).then(function() {
          console.log("Copied text");
      }, function() {
          console.error("There was an error copying");
      });
  };


})
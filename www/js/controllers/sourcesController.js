angular.module('leder.sourcesController', [])

.controller('SourcesCtrl', function($scope, Sources, $stateParams, $ionicModal, EvernoteOAuth) {
 
  // $scope.sources = Sources.getSourcesForProject($stateParams.ProjectId); 
  console.log($stateParams);
  EvernoteOAuth.getAllNoteTitles(function(error, notetitles) {
  		$scope.sourceNotes = notetitles;
  });

})
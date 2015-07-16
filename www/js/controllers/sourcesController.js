angular.module('leder.sourcesController', [])

.controller('SourcesCtrl', function($scope, Sources, $stateParams, $ionicModal, EvernoteOAuth) {
 
  // $scope.sources = Sources.getSourcesForProject($stateParams.ProjectId); 
  console.log($stateParams);
  EvernoteOAuth.getAllNoteTitles(function(error, notetitles) {
  		$scope.sourceNotes = notetitles;
  });

  $scope.saveSourceNotes = function() {
  	console.log("working");
  	for (var i=0; i < $scope.sourceNotes.length; i++) {

  		if ($scope.sourceNotes[i].touched) {
  			console.log("Note has been tagged");
  			console.log($scope.sourceNotes[i]);
  		} else {
  			console.log("not tagged :(");
  		}
  	};
  }

})
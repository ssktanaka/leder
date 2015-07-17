angular.module('leder.sourcesController', [])

.controller('SourcesCtrl', function($scope, Sources, $stateParams, $ionicModal, EvernoteOAuth, ProjectService) {
 
  EvernoteOAuth.getAllNoteTitles(function(error, notetitles) {
      //populate page with source notes
  		$scope.sourceNotes = notetitles;
  });

  //function save source notes is called when user clicks "import notes"
  $scope.saveSourceNotes = function() {
    $scope.sourceArray = [];

  	for (var i=0; i < $scope.sourceNotes.length; i++) {
      //if the "touched" attribute of the div is true
  		if ($scope.sourceNotes[i].touched) {
  			console.log("Note has been tagged");
        $scope.sourceArray.push($scope.sourceNotes[i]);
  		} else {
  			//do nothing
  		}
  	};

    //update project object with cnew source array
    ProjectService.updateProjectObject($stateParams.ProjectId, $scope.sourceArray);
  }

})
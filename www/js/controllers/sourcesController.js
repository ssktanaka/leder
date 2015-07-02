angular.module('leder.sourcesController', [])

.controller('SourcesCtrl', function($scope, Sources, $stateParams, $ionicModal) {
  $scope.sources = Sources.getSourcesForProject($stateParams.ProjectId); 

})
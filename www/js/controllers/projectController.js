angular.module('leder.projectController', [])


.controller('ProjectsCtrl', function($scope, Sources, $stateParams) {
  $scope.sources = Sources.all();


})
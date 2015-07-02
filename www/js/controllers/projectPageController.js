angular.module('leder.projectPageController', [])


.controller('ProjectPageCtrl', function($scope, Sources, $stateParams) {
  //get project ID and set in url
  $scope.projectID = $stateParams.ProjectId;


})
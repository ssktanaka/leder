'use strict';

/* Services */

var noteServices = angular.module('noteServices', ['ngResource']);

noteServices.factory('Note', ['$resource',
  function($resource){
    return $resource('notes/:noteId.json', {}, {
      query: {method:'GET', params:{noteId:'notes'}, isArray:true}
    });
  }]);

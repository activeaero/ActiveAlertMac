(function() {
  'use strict';

  function taskListDirective ($log) {

    return {
      restrict: 'E',
      templateUrl: '../templates/directives/taskList.html',
      scope: {
        tasks: '=tasks',
        incident: '=incident'
      }
    };
  }

  angular.module('erpClient')
    .directive('taskList', taskListDirective);

}());

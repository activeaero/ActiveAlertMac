(function() {
  'use strict';

  function commBoardContentDirective ($log) {

    return {
      restrict: 'E',
      template: '<div class="item item-image" style="width: 20%;" ng-if="img === true" ><img src="{{content}}"/></div>'+
      '<p ng-if="img === false">{{content}}</p>',
      scope: {
        img:'=',
        content: '='
      }
    };
  }

  angular.module('erpClient')
    .directive('commBoardContent', commBoardContentDirective);

}());

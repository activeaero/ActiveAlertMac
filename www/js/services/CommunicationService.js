(function(){
  'use strict';
//TODO: Hook service into EventLog ADD/UPDATE/ARCHIVE Procs
  //TODO: Install Socket.io on AAG-API02
  function  CommunicationService ($http, $log, DSP_URL) {
    return {
      push: function (message) {
        
      }
    };

  }

  angular.module('erpClient').service('CommunicationSrvc', CommunicationService);


})();

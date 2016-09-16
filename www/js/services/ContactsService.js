(function(){
  'use strict';

  function  ContactsService ($http, $log, DSP_URL) {
    return {
      getContacts: function(id) {
        var payload = {
          "params": {
            "name": "CompanyId",
            "param_type": "IN",
            "value": id
          }
        };


        // return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Contact$Return');
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Contact$ReturnByCompanyId',payload);
      },
      getContact: function(id){
         var payload = {
          "params": {
            "name": "ContactId",
            "param_type": "IN",
            "value": id
          }
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Contact$ReturnById',payload);
      }
    };

  }

  angular.module('erpClient').service('ContactsSrvc', ContactsService);


})();

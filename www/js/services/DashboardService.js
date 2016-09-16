(function(){
	'use strict';

  function DashboardService($http, DSP_URL){
    return {
      getMainCategories: function () {
        var payload = {
          "params": {
            "name": "ParentId",
            "param_type": "IN",
            "value": 0
          }
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Category$ReturnByParent', payload);
      },
      getCategoryByParentId: function (id) {
        var payload = {
          "params": {
            "name": "ParentId",
            "param_type": "IN",
            "value": id
          }
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Category$ReturnByParent', payload);
      },
      getAllCategories: function () {
        var payload = {
          "params": {
            "name": "CompanyId",
            "param_type": "IN",
            "value": 1
          }
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Category$ReturnByCompanyId', payload);
      },

      sendFilesToServer: function(payload){
        return $http.post(DSP_URL + '/api/v2/files/'+payload.path, payload);
      },

      getIncident: function (param) {
        var payload = {
          "params": [
            {
              "name": "IncidentId",
              "param_type": "IN",
              "value": parseInt(param.IncidentId)
            },
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": parseInt(param.CompanyId) || 1
            }
            ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Incident$ReturnByIncidentId', payload);
      },
      getCurrentIncident: function (id) {
        var payload = {
          "params": [
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": parseInt(id) || 1
            }
          ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Incident$ReturnCurrent', payload);
      },
      getOpenIncidents: function (id) {
        var payload = {
          "params": [
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": parseInt(id) || 1
            }
          ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Incident$ReturnUnresolved', payload);
      },
      getAcknowledgementWithIncidentId: function(opts) {
        var payload = {
          "params": [
            {
              "name": "IncidentId",
              "param_type": "IN",
              "value": parseInt(opts.IncidentId)
            },
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": parseInt(opts.CompanyId)
            }
          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$EventLog$ReturnByIncidentId', payload);
      },
      getAcknowledgementWithoutIncidentId: function(opts) {console.log('these are opts',opts);
        var payload = {
          "params": [
            {
              "name": "UserId",
              "param_type": "IN",
              "value": parseInt(opts.UserId)
            },
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": parseInt(opts.CompanyId)
            }
          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$EventLog$AnsweredIncidents$ReturnByUserId', payload);
      }
    };

  }

  angular.module('erpClient').service('DashboardSrvc', DashboardService);


})();

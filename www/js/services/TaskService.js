(function(){
  'use strict';

  function TaskService ($http, $log, DSP_URL) {
    var tasks = [];
    return {
      getTasks: function (IncidentId, RoleId) {
        var payload = {
          "params": [
            {
              "name": "RoleId",
              "param_type": "IN",
              "value": parseInt(RoleId) || null
            },
            {
              "name": "IncidentId",
              "param_type": "IN",
              "value": parseInt(IncidentId) || 1
            }

          ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Task$ReturnByIncidentId',payload);
      },
      getTaskDetails: function (id) {
        var payload = {
          "params": {
            "name": "TaskId",
            "param_type": "IN",
            "value": id
          }
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Task$ReturnDetailAndOptions',payload);
      },
      getTasksByRole: function (params) {
        var payload = {
          "params": [
            {
              "name": "CategoryId",
              "param_type": "IN",
              "value": params.CategoryId
            },
            {
              "name": "RoleId",
              "param_type": "IN",
              "value": params.RoleId
            }
            ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$CategoryTask$ReturnByRole', payload);
      },
      getTaskDetail: function (id) {
        var payload = {
          "params": {
            "name": "TaskId",
            "param_type": "IN",
            "value": id
          }
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Task$ReturnByTaskId', payload);
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

      editDevice: function () {
        var payload = {
          "params": [
            {
              "name": "UserId",
              "param_type": "IN",
              "value": "1004"
            },
            {
              "name": "LastModBy",
              "param_type": "IN",
              "value": ""
            },
            {
              "name": "DeviceId",
              "param_type": "IN",
              "value": "99000582658796"
            }
          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$User$UpdateDevice', payload);
      }
    };
  }

  angular.module('erpClient').service('TaskSrvc', TaskService);


})();

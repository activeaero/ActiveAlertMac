(function(){
  'use strict';

  function  UsersService ($http, $log, DSP_URL) {
    var contacts = [];
    return {
      editUser: function (user) {
        var payload = {
          "params": [
            {
              "name": "UserId",
              "param_type": "IN",
              "value": parseInt(user.UserId)
            },
            {
              "name": "UserName",
              "param_type": "IN",
              "value": user.UserName
            },
            {
              "name": "Password",
              "param_type": "IN",
              "value": user.Password
            },
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": parseInt(user.CompanyId)
            },
            {
              "name": "Email",
              "param_type": "IN",
              "value": user.Email
            },
            {
              "name": "FirstName",
              "param_type": "IN",
              "value": user.FirstName
            },
            {
              "name": "LastName",
              "param_type": "IN",
              "value": user.LastName
            },
            {
              "name": "IsAdmin",
              "param_type": "IN",
              "value": user.IsAdmin || false
            },
            {
              "name": "IsAlternate",
              "param_type": "IN",
              "value": user.IsAlternate || false
            },
            {
              "name": "LastModBy",
              "param_type": "IN",
              "value": parseInt(user.UserId)
            },
            {
              "name": "AlternateId",
              "param_type": "IN",
              "value": parseInt(user.AlternateId) | null
            },
            {
              "name": "PositionId",
              "param_type": "IN",
              "value": parseInt(user.PositionId)
            }


          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$User$Update', payload);
      },
      getUser: function (user) {console.log('cid',user.ContactId);
        var payload = {
          "params": [
            {
              "name": "ContactId",
              "param_type": "IN",
              "value": parseInt(user.ContactId)
            }
          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Contact$ReturnById', payload);
      },
      updateRole: function (role) {
        var payload = {
          "params": [
            {
              "name": "RoleId",
              "param_type": "IN",
              "value": role.RoleId
            },
            {
              "name": "RoleName",
              "param_type": "IN",
              "value": role.RoleName
            },
            {
              "name": "ShortName",
              "param_type": "IN",
              "value": role.ShortName
            },
            {
              "name": "Archived",
              "param_type": "IN",
              "value": false
            },
            {
              "name": "LastModBy",
              "param_type": "IN",
              "value": null
            }
          ]
        };

        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Role$Update',payload);
      },
      getRoles: function (id) {
        var payload = {
          params : [
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": id || 1
            }
          ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Position$ReturnByCompany',payload);
      },
      getContactPosition: function (id) {
        var payload = {
          params : [
            {
              "name": "CompanyId",
              "param_type": "IN",
              "value": id || 1
            }
          ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$ContactPosition$ReturnByCompany',payload);
      }

    };

  }

  angular.module('erpClient').service('UsersSrvc', UsersService);


})();

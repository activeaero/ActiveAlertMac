(function(){
	'use strict';

  function CategoriesService ($http, $log, DSP_URL) {

    return {
      getCategories: function() {
        return $http.get(DSP_URL + '/api/v2/mssql/_table/Category');
      },
      getCategoryTasks: function() {
        return $http.get(DSP_URL + '/api/v2/mssql/_table/CategoryTask');
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
      }
    };

  }

	angular.module('erpClient').service('CategoriesSrvc', CategoriesService);


})();

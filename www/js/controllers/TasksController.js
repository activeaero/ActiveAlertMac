(function (){
  'use strict';

  function TasksController($state, $stateParams, $rootScope, $log, TaskSrvc, SessionStore) {
    var vm = this;

    vm.categories = [];
    // vm.tabsTemplate = './templates/tabs.html';
    vm.taskList = {};
    vm.sessionTasks = [];
    vm.message = $rootScope.message;
    vm.userData = SessionStore.get('user',true);
    // vm.incidentList = SessionStore.get('incident',true);

    // vm.gotoTask = gotoTask;

    function init () {
      var theTasks = [];
      TaskSrvc.getOpenIncidents(vm.userData.CompanyId).then(function(data){
        vm.incidents = data.data;
        _.forEach(vm.incidents, function(val,key){
          getTasks(val);
        });

      });


    }

    function getTasks(val) {
      // var taskList = {};
      // vm.taskList = SessionStore.get('tasks', true);

      // if(!vm.taskList){
        TaskSrvc.getTasks(val.IncidentId, vm.userData.RoleId).then(function (result) {
          var taskList = result.data;console.log('the tasklist',taskList);
          _.forEach(taskList, function(val2,key){
            val2['checked']=false;
          });

          val['taskList'] = taskList;console.log('valtasklist',val.taskList);

          vm.sessionTasks.push(taskList);
          SessionStore.set('tasks', vm.sessionTasks, true);
        });
      // }


    }

    // function gotoTask(id) {console.log('this is the id',id);
    //       $state.go('app.tabs.detail',{id:id});
    //     }

    init();

  }

  angular.module('erpClient').controller('TasksCtrl', TasksController);


})();

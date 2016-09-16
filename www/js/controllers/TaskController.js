(function (){
  'use strict';

  function TaskController($rootScope, $state, $stateParams, $log, TaskSrvc, SessionStore) {
    var vm = this;

    vm.checked = false;
    vm.currentTask = $stateParams.id;

    function init() {
      getTask();
      //vm.task = task.data[0] != undefined ? task.data[0] : taskDetail.data[0];

      /**Get tasks from sessionStorage, then parse out to get the correct set of tasks**/
      vm.tasks = $stateParams.tasks;

    }

    init();

    function getTask(){
      TaskSrvc.getTaskDetail(parseInt(vm.currentTask)).then(function (result) {
       vm.task = result.data[0];
          //       var str = mapped[0].Options;
          //       task['button'] = angular.fromJson(str.replace(/'/g, '"'));
          //       vm.task = _.cloneDeep(task);
          //       console.log('Here is the TASK',vm.task);
          //
          //     },
          //     function(error){
          //       $log.debug('Error',error.message)
          //     });
          // },
          // function(error){
          //   $log.debug('Error',error.message)
          // });
        },
        function(error){
          $log.debug('Error',error.message)
        });
     }


  }
  angular.module('erpClient').controller('TaskCtrl', TaskController);



})();


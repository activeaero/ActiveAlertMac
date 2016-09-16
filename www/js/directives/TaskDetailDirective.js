(function(){
  'use strict';

  function taskDetail(){

    var TaskDetailController = function ($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicViewSwitcher, $cordovaSms, SessionStore, PushSrvc){

      var vm = this;

      /*member variables*/
      vm.contactTemplate = './templates/taskContact.html';

      vm.currentTask = $stateParams.id;
      var someTasks = SessionStore.get('tasks',true);
      var currentIndex = '';
      /*function definitions*/
      vm.completed = completed;
      vm.defer = defer;
      vm.toNextTask = toNextTask;
      vm.toPrevTask = toPrevTask;
      vm.dialNumber = dialNumber;

      init();

      function init(){
        $scope.$watch('task', function(newval){
          if(newval !== undefined){
            getCurrentTaskIndex($scope.task);
          }
        });

      }

      function getCurrentTaskIndex(thisTask){
        $scope.$watch('tasks', function(newval){
          if(newval !== undefined){
            tasks = $scope.tasks;

            currentIndex =_.findIndex(tasks, function(value){
              if(value !== null){
                return value.TaskDescription === thisTask.TaskDescription;
              }
            });
          }
        });

      }

      function completed(){
        /*****
         * Get the tasks from the SessionStore, then iterate through them and find the index of the task in the list that matches the current task.
         * Change the checked value to true so that when the user returns to the task list, the task is now checked.
         */

        tasks[currentIndex].checked = true;
        SessionStore.set('tasks', tasks, true);

        $state.go('app.tabs.tasks');

      }

      function defer(){

        var alertPopup = $ionicPopup.alert({
          title: 'Defer to Alternate',
          template: 'Deferment Sent'
        });

        alertPopup.then(function(res) {
          console.log('Defer to Alternate and send completed signal to tasks list');
          $state.go('app.tasks');//,{},{reload:true});
        });

      }

      function toNextTask(){
        if(parseInt(parseInt(currentIndex)) === tasks.length-1){
          $state.go('app.tabs.detail',{id:parseInt(tasks[0].TaskId)},{reload:true});
        }

        else{
          $state.go('app.tabs.detail',{id:parseInt(tasks[parseInt(currentIndex)+1].TaskId)},{reload:true});
        }
      }

      function toPrevTask(){
        if(parseInt(currentIndex) === 0){
          $state.go('app.tabs.detail',{id:parseInt(tasks[parseInt(tasks.length)-1].TaskId)},{reload:true});
        }

        else{
          $state.go('app.tabs.detail',{id:parseInt(tasks[parseInt(currentIndex)-1].TaskId)},{reload:true});
        }
      }

      function dialNumber(number) {
        window.open('tel: 1' + number, '_system');
      }

      function sendMessage(number) {
        $cordovaSms
          .send('phonenumber', 'SMS content', options)
          .then(function() {
            // Success! SMS was sent
          }, function(error) {
            // An error occurred
          });
      }
    };
    var template = '<h3>Contact Information</h3>'+
      '<div ng-repeat="btn in buttons">'+
      '<button class="button button-assertive icon-left ion-ios-telephone"><a href="tel:{{task.number}}" class="white">{{task.ButtonText}}</a></button>'+
      '</div>';

    return {
      restrict: 'E',
      templateUrl: './templates/directives/taskDetail.html',
      scope: {
        task: '=task',
        tasks: '=tasks',
        class: '@class'/*,
         currentTaskId: '=currentTaskId',
         toNextTask: '&toNextTask'*/
      },
      controller: TaskDetailController,
      controllerAs: 'ctrl'/*,
      link: function (scope, element, attrs) {
        console.log('scope',scope);
        //var compiled = $compile(template)(scope);
        //element.append(compiled);


      }*/
    };

  }

  angular.module('erpClient').directive('taskDetail', taskDetail);

})();

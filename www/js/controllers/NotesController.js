(function (){
  'use strict';

  function NotesController() {

    var vm = this;
    vm.submitNote = submitNote;

    //vm.noteIndex = [];

   function submitNote(note){
      console.log('Note submitted', vm.noteIndex);
      console.log('Note submitted', note);
    }


  }

  angular.module('erpClient').controller('NotesCtrl', NotesController);

})();

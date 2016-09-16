(function (){
  'use strict';

  function CameraController($cordovaCamera, $log, DashboardSrvc, CameraSrvc, AmazonSrvc, SessionStore, socket) {
    var vm = this;

    vm.takePicture = takePicture;
    vm.uploadPictures = uploadPictures;
    vm.userData = SessionStore.get('user', true);
    vm.images = [];//[{'imgURI':'http://placehold.it/450x300'}];

    function init(){$log.debug('im in here cam');
      getOpenIncidents();
    }

    function getOpenIncidents(){
      DashboardSrvc.getAcknowledgementWithoutIncidentId({'UserId':vm.userData.UserId, 'CompanyId':vm.userData.CompanyId}).then(function(data){
        vm.incidents = _.flattenDeep(data.data);console.log('openones',vm.incidents);
        _.forEach(vm.incidents, function(val,key){
          val.IncidentDate = new Date(val.IncidentDate);
        });
        var list = angular.fromJson(data.data[0].IncidentList);
        $log.debug('list returned',list);
        vm.incidentDate = new Date(data.data[0].IncidentDate);

      },function(error){
        $log.debug('Incident pull',error);
      });


    }

    function takePicture() {
      var options = {
        quality: 100,
        // destinationType: Camera.DestinationType.NATIVE_URI,
        // destinationType: Camera.DestinationType.FILE_URI,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.PNG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        vm.imgURI = "data:image/png;base64," + imageData;
        vm.theUrl = imageData;
        vm.blobFile = dataURItoBlob(vm.imgURI);
        // vm.images = [];
        vm.images.push(vm.imgURI);
        // processPicture();
      }, function (err) {
        // An error occured. Show a message to the user
      });
    }

    function dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }

    function processPicture(){
      console.log('Do something with this picture, probably send it to a repository for recovery', vm.imgURI);

      // pushMessage(vm.imgURI);

      var today = new Date('DDMMYYYY');
      /*
      var payload =
       {
       "name": "incident"+today+vm.filename,
       "path": "incident"+today,
       "metadata": [
       incident"+today+vm.filename
       ],
       "resource": [
       {
       "name": incident"+today+vm.filename,
       "path": incident"+today,
       "content_type": "image/png",
       //"content_type": "multipart/form-data",
       "metadata": [
       incident"+today+vm.filename
       ]
       }
       ]
       };
       */
      // DashboardSrvc.sendFilesToServer(payload).then(function(response){
      //   console.log('Files successfully sent',response);
      // }, function(error){
      //   console.debug('Error sending files',error);
      // });
    }

    function uploadPictures(){
      // console.log('images',vm.images);
      // console.log('images',vm.imgURI);

      getFileEntry(vm.theUrl);


      // _.forEach(vm.images, function(val,key){console.log('img',val);
      //   opts[image] = val;
      //   console.debug('opts',opts);
      //   // CameraSrvc.uploadPictures(opts).then(function (result){
      //   //   console.debug(result.data);
      //   //       CameraSrvc.attachPictures(payload).then(function (data){
      //   //         console.debug(data.data);
      //   //       });
      //   // }, function(error){
      //   //   console.debug('error',error);
      //   // });
      // });

    }

    function sendFile(fileInfo){
      var opts = {
        'date': new Date(),
        'image': {
          "name": new Date(),
          "path": '',
          "resource": [
            {
              "name": fileInfo.name,
              "path": fileInfo.fullPath || fileInfo.localURL,
              "content_type": "image/png"
            }
          ]
        }
      };
      // console.log('this is fe',angular.toJson(fileInfo));
      var payload = {
        'IncidentId':vm.currentIncidentId,
        'AttachmentType': 'image',
        'FileName':fileInfo.name,
        'FilePath':'/'+new Date()+'/',
        'UserId':vm.userData.UserId
      };
console.log('opts',opts.image.path);
      // CameraSrvc.uploadPictures(opts).then(function (result) {
      //   console.debug('upload', angular.toJson(result.data));
      //   CameraSrvc.attachPictures(payload).then(function (data){
      //     console.debug('attach',angular.toJson(data.data));
      //   }, function(error){
      //     console.debug('error attaching',error.data);
      //   });
      // }, function(error){
      //   console.debug('error',error);
      // });

      AmazonSrvc.uploadFile(fileInfo,vm.blobFile);
      CameraSrvc.attachPictures(payload).then(function (data){
        console.debug('attach',angular.toJson(data.data));
      }, function(error){
        console.debug('error attaching',error.data);
      });
    }

    function pushMessage (message) {
      var timeStamp = moment();
      var obj = {user: vm.userData.name, msgDate: timeStamp, content: message};
      socket.emit('LogUpdated', { message: obj });
      $log.debug('obj sent', obj);
    }

    // socket.on('UpdateLog', function (data) {
    //   var obj = data.message;
    //   vm.eventLog.push(obj);
    //   SessionStore.set('communication', vm.eventLog, true);
    //   $log.debug('socket data', obj);
    // });
    //
    // vm.incidentList = SessionStore.get('incidentList', true);
    //
    // socket.on('connect', function(data) {
    //   if ( angular.isDefined(vm.incidentList) ) {
    //     socket.emit('incident', vm.incidentList);
    //   } else {
    //     vm.incidentList = data;
    //     $log.debug('socket incident data', data);
    //   }
    // });

    function getFileEntry(imgUri) {//console.debug('ma', imgUri);
      window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

        // Do something with the FileEntry object, like write to it, upload it, etc.
        // writeFile(fileEntry, imgUri);
        // console.log("got file: " ,fileEntry.fullPath, fileEntry.name);
        // vm.fileEntry = fileEntry;
        sendFile(fileEntry);
        // displayFileData(fileEntry.nativeURL, "Native URL");

      }, function (error) {
        // If don't get the FileEntry (which may happen when testing
        // on some emulators), copy to a new FileEntry.
        createNewFileEntry(imgUri);
        // console.log('WAITTTTT',angular.toJson(error));
      });
    }

    function createNewFileEntry(imgUri) {
      window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

        // JPEG file
        dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
          // Do something with it, like write to it, upload it, etc.
          // fileEntry.createWriter(function(fw){
          //   fw.write(imgUri);
          //   console.log("got file: " ,angular.toJson(fw));
          //   sendFile(fw);
          // });
          // writeFile(fileEntry, imgUri);
          // console.log("got file: " ,fileEntry.fullPath, fileEntry.name);
          // vm.fileEntry = fileEntry;
// console.log('imgUri',JSON.stringify(imgUri));
          fileEntry.name = new Date() + '.png';
          console.log('fileEntry',JSON.stringify(fileEntry));
          sendFile(fileEntry);
          // displayFileData(fileEntry.fullPath, "File copied to");

        }, function(errorFile){
          console.debug('there was an error creating file:',angular.toJson(errorFile));
        });

      }, function(errorURL){
        console.debug('there was an error resolving the url:',angular.toJson(errorURL));
      });
    }

    init();
  }

  angular.module('erpClient').controller('CameraCtrl', CameraController);

})();

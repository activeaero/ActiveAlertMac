(function(){
  'use strict';

  function CameraService($http, $log, DSP_URL){
    return {
      uploadPictures: function(opts) {
        return $http.post(DSP_URL + '/api/v2/files', opts.image);
        // return $http.post(DSP_URL + '/api/v2/files/'+ opts.date, opts.image);
        // return $http.post(DSP_URL + '/api/v2/files/'+ opts.date + '/?url=' + opts.image.path);
      },
      attachPictures: function(opts) {
        var payload = {
          "params": [
            {
              "name": "IncidentId",
              "param_type": "IN",
              "value": parseInt(opts.IncidentId)
            },
            {
              "name": "AttachmentType",
              "param_type": "IN",
              "value": opts.AttachmentType
            },
            {
              "name": "FileName",
              "param_type": "IN",
              "value": opts.FileName
            },
            {
              "name": "FilePath",
              "param_type": "IN",
              "value": opts.FilePath
            },
            {
              "name": "UserId",
              "param_type": "IN",
              "value": parseInt(opts.UserId)
            }
          ]
        };
        return $http.post(DSP_URL + '/api/v2/mssql/_proc/sp$Attachment$Add', payload);
      }
    }

  }

  angular.module('erpClient').service('CameraSrvc', CameraService);


})();

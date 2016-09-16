(function(){
  'use strict';

  function AmazonService($http, $log, DSP_URL){
    // See the Configuring section to configure credentials in the SDK
    AWS.config.credentials ={};
    AWS.config.update({accessKeyId: 'AKIAIFZOIDLGGMUOR2RQ', secretAccessKey: 'B1wniM5SyG2VQZ2bKI0L2QUhgWSU8z3a4RvlhG8Z'});
    // Configure your region
    AWS.config.region = 'us-east-1';
    var bucket = new AWS.S3({params: {Bucket: 'activealert'}});
    var s3 = new AWS.S3();

    return {
      uploadFile: function(theFile, fileContent){
        var params = {Key: theFile.name, Bucket: 'activealert', ContentType: 'image/png', Body: fileContent};
        // var params = {Key: theFile.name, ContentType: 'image/png', Body: theFile};
        // console.dir('theFile',theFile);
        $log.debug('theFile',JSON.stringify(theFile));
        // bucket.upload(params, function (err, data) {
        // s3.upload(params, function (err, data) {
        s3.putObject(params, function (err, data) {
          if(err){
            console.debug('file upload error',JSON.stringify(err));
          }

          else{
            console.debug('file uploaded',JSON.stringify(data));
          }
        });
      },
      listFiles: function(){
        bucket.listObjects(function (err, data) {
          if (err) {
            document.getElementById('status').innerHTML =
              'Could not load objects from S3';
          } else {
            console.debug('These are the objects listed',data);
            }
        });
      }
    }
  }

  angular.module('erpClient').service('AmazonSrvc', AmazonService);


})();

testauth.directive('uploadfile', ['uploadManager', function factory(uploadManager) {
    return {
        restrict: "A",
        scope: {
            uploadurl: "=",
            customdata: "&"
        },
        controller: function($scope, $attrs) {
            $scope.$on('fileRemoved', function (e, index) {
                uploadManager.remove(index);
            });
        },
        link: function(scope, elem, attrs) {
            var uploadOptions;
            uploadOptions = {
                url: scope.uploadurl,
                dataType: "json"
            };
            uploadOptions.add = function(e, data) {
            	uploadManager.add(data);
            };
            uploadOptions.done = function(e, data) {
                uploadManager.done(data);
            };
            uploadOptions.fail = function(e, data) {
                uploadManager.error(data);
            };
            uploadOptions.progress = function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                uploadManager.setProgress(progress);
            };
            return elem.fileupload(uploadOptions).bind("fileuploadsubmit", function(e, data) {
                return data.formData = {
                    params: JSON.stringify(scope.customdata())
                };
            });
        }
    };
}]);

testauth.factory('uploadManager', function ($rootScope) {
    var filesToUpload = [];
    return {
        add: function (file) {
            filesToUpload.push(file);
            $rootScope.$broadcast('fileAdded', file);
        },
        remove: function (index) {
            filesToUpload.splice(index, 1);
        },
        done: function (file) {
            $rootScope.$broadcast('fileUploadDone', file);
        },
        error: function (file) {
            $rootScope.$broadcast('fileUploadError', file);
        },
        clear: function () {
            filesToUpload = [];
        },
        files: function () {
            fileNames = [];
            $.each(filesToUpload, function (index, file) {
                fileNames.push(file.files[0].name);
            });
            return fileNames;
        },
        upload: function () {
            $.each(filesToUpload, function (index, file) {
                file.submit();
            });
            this.clear();
        },
        setProgress: function (percentage) {
            $rootScope.$broadcast('uploadProgress', percentage);
        }
    };
});

var mainApp = angular.module("cms", ['ngRoute','ngCookies']);
mainApp.config(['$routeProvider',
                function($routeProvider){
                	$routeProvider.
                		when('/sections/:message', { 
                			templateUrl:'sections.htm',
                			controller:'sections_list'
                		}).
                		when('/sections_add', { 
                			templateUrl:'sections_add.htm',
                			controller:'sections_add'
                		}).
                		when('/sections_edit/:sectionIndex', { 
                			templateUrl:'sections_edit.htm',
                			controller:'sections_edit'
                		}).
                		otherwise({
                		 	redirectTo: '/'
                		});
                }]);
mainApp.service('sharedProperties', function ($http , $q, $cookies) {
    var url="api.php";
	
    return ({
        getSections: getSections,
        addSection: addSection,
        getSectionForIndex: function(index){
            return  JSON.parse($cookies.get('sections'));
        },
        updateSectionByIndex: updateSectionByIndex,
    });
    function getSections(){
        var request= $http.post(url,{action:'get_sections'});
        $cookies.put('sections', JSON.stringify(request.then( handleSuccess, handleError )));
        return( request.then( handleSuccess, handleError ) );
    }
    function addSection(value){
        var request= $http.post(url,{action:'section_add', section_name:value});
        return( request.then( handleSuccess, handleError ) );
    }
    function updateSectionByIndex(index, value){
        var request= $http.post(url,{action:'section_edit', section_id:index, section_name:value});
    }
    // I transform the error response, unwrapping the application data from
    // the API response payload.
    function handleError( response ) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (! angular.isObject( response.data ) || ! response.data.message ) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }

});
mainApp.controller("sections_list", function($scope,$routeParams, $cookies, sharedProperties) {
    $scope.message = $routeParams.message;
    // console.log($scope.message);
    function loadRemoteData() {
        // The sharedProperties service returns a promise.
        sharedProperties.getSections().then(
            function( response ) {
                applyRemoteData( response );
            });
    }
    // I apply the remote data to the local scope.
    function applyRemoteData( sections ) {
        $scope.sections = sections;
    }
    loadRemoteData();
    // console.log($scope.sections);
});

mainApp.controller('sections_add', function ($location ,$scope, $routeParams, sharedProperties) {
    // $scope.$watch('files', function () {
    //     $scope.upload($scope.files);
    // });
	$scope.update = function(section) {
    	var result=sharedProperties.addSection(section.section_name);
        $location.path('/sections/add-success');
        $routeParams.reload();
  	};
	
    //$scope.username = 'ammar';
    // $scope.upload = function (files) {
    //     if (files && files.length) {
    //         for (var i = 0; i < files.length; i++) {
    //             var file = files[i];
    //             Upload.upload({
    //                 url: 'upload.php',
    //                 fields: {'username': $scope.username},
    //                 file: file
    //             }).progress(function (evt) {
    //                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //                 console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
    //             }).success(function (data, status, headers, config) {
    //                 console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
    //             }).error(function (data, status, headers, config) {
    //                 console.log('error status: ' + status);
    //             })
    //         }
    //     }
    // };
});
mainApp.controller("sections_edit", function($location,$scope, $routeParams, sharedProperties) {
    function loadRemoteData() {
        sharedProperties.getSectionForIndex().then(
            function( response ) {
                applyRemoteData( response );
            });
    }
    // I apply the remote data to the local scope.
    function applyRemoteData( sections ) {
        $scope.sections = sections;
        for (var item of sections) {
            if(item.section_id == $routeParams.sectionIndex){
                $scope.section_name = item.section_name;
            }
        }
    }
    loadRemoteData();
	$scope.sectionIndex = $routeParams.sectionIndex;
    //$scope.section_name = sharedProperties.getSectionByIndex($scope.sectionIndex);
    // console.log($scope.sections);
    $scope.update = function( section){
    	sharedProperties.updateSectionByIndex($scope.sectionIndex, section);
    	//$scope.master = angular.copy(sharedProperties.getSections());
        //console.log( $location.path('/sections'));
        $location.path('/sections/edit-success');
        $routeParams.reload();
    }
   
});
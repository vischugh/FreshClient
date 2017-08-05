(function(angular){

    "use strict";

    angular
        .module("FreshApp")
        .controller("Fresh.MainController", ["$scope", freshController])

        function freshController($scope){
            //Public Variables
            $scope.user = {};

            //Public Functions
            $scope.ValidateUser = validateUser;

            function validateUser(){
                //Call resource to validate user 
            }
        }
})
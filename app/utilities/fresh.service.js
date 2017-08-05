(function(angular){

    "use strict";

    angular
        .module('FreshApp')
        .service('FreshApp.Service', ['Fresh.SurveyConstants', freshService])

    function freshService(freshConstants){
        var vm = this;

        vm.RespObject = null;
        vm.SurveyType = freshConstants.TypeOfSurvey.PrePractice;
        vm.SurveyType = '';
        vm.Status = '';
    }
})(angular);
/**
 * Created by Vishal on 18-03-2017.
 */
(function(angular){

    "use strict";

    angular
        .module("FreshApp")
        .factory("FreshApp.Factory",[freshFactory]);

    function freshFactory(){

        var factoryObj = {};

        factoryObj.Answer = answer;

        function answer(){
            this.Date = {
                TodayDate: '',
                TodayMonth: '',
                TodayYear: ''
            };
        }

        return factoryObj;
    }
})(angular);

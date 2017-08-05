/**
 * Created by Vishal on 17-03-2017.
 */
(function (angular) {

    "use strict";

    angular
        .module("FreshApp")
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/Login/views/login.html',
                controller: 'FreshApp.LoginController'
            })
            .when('/Signup', {
                templateUrl: 'app/components/Login/views/signup.html',
                controller: 'FreshApp.LoginController'
            })
            .when('/Survey', {
                templateUrl: 'app/components/Survey/survey.html',
                controller: 'Fresh.SurveyController'
            })
            .when('/ATCSurvey', {
                templateUrl: 'app/components/ATC/survey.html',
                controller: 'Fresh.ATCController'
            })
            .when('/MainPage', {
                templateUrl: 'app/components/mainPage.html',
                controller: 'FreshApp.LoginController'
            })
            .when('/Results', {
                templateUrl: 'app/components/Results/views/results.html',
                controller: 'Fresh.ResultsController'
            })
            .when('/ApprovePlayers', {
                templateUrl: 'app/components/ATC/approvePlayers.html',
                controller: 'Fresh.ATCController'
            })
            .when('/ATCPlayers', {
                templateUrl: 'app/components/ATC/atc_players.html',
                controller: 'Fresh.ATCController'
            })
            .when('/IndividualAnswers', {
                templateUrl: 'app/components/Results/views/atc_individual.html',
                controller: 'Fresh.ResultsController'
            })
            .when('/Calendar', {
                templateUrl: 'app/components/Calendar/calendar.html',
                controller: 'FreshApp.CalendarController'
            })
            .when('/AddTeam', {
                templateUrl: 'app/components/ATC/addTeam.html',
                controller: 'Fresh.ATCController'
            })

            .otherwise({ redirectTo: '/' });
    }
})(angular);

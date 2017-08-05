(function (angular) {

    "use strict";

    angular
        .module("FreshApp")
        .controller("Fresh.ResultsController", ['$scope', 'Fresh.SurveyConstants', 'FreshApp.Service', '$resource', '$cookies', '$location', resultsController]);

    function resultsController($scope, surveyConstants, freshService, $resource, $cookies, $location) {

        //Public Variables
        $scope.VisibleQuestion = new Array(8);
        $scope.respObject = freshService.RespObject;
        $scope.QuestionFilter = 1;
        $scope.DateFilter = '';
        $scope.Aggregate = {};

        //Public Functions
        $scope.ShowQuestion = showQuestion;
        $scope.GetTemplateUrl = getTemplateUrl;
        $scope.HideNavigationButtons = hideNavigationButtons;
        $scope.ShowResult = showResult;
        $scope.ApplyDateFilter = applyDateFilter;
        $scope.RemoveFilters = removeFilters;
        $scope.GetIndividualPlayerDataForATC = getIndividualPlayerDataForATC;

        loadResultsData();

        for (var i = 1; i <= 8; i++) {
            $scope.VisibleQuestion[i] = true;
        }

        function getTemplateUrl() {
            switch (parseInt(freshService.RespObject.UserType)) {
                case surveyConstants.RespondentType.Player:
                    return "./app/components/Results/views/player.html";
                case surveyConstants.RespondentType.Coach:
                    return "./app/components/Results/views/coach.html";
                case surveyConstants.RespondentType.AthleticTrainer:
                    return "./app/components/Results/views/atc.html";
            }
        }

        function showQuestion(questionVisible) {
            for (var i = 0; i < $scope.VisibleQuestion.length; i++) {
                if (i == questionVisible) {
                    $scope.VisibleQuestion[i] = true;
                } else {
                    $scope.VisibleQuestion[i] = false;
                }
            }
        }
        function hideNavigationButtons() {
            $scope.HideButtons = true;
        }

        function loadResultsData() {
            //Get the required Data of User
            var getResultResource;
            var getAverageResultResource;
            console.log('Loading Result data');

            var url = $location.search();
            var playerId = url.PlayerId;
            //Check whether redirected for individual player results
            if (playerId) {
                getIndividualPlayerDataForATC(playerId);
            } else {
                if (freshService.RespObject.UserType == surveyConstants.RespondentType.Player) {
                    getResultResource = $resource('https://freshserver.herokuapp.com/player/getdata/:playerId');
                    getAverageResultResource = $resource('https://freshserver.herokuapp.com/player/aggresults/:playerId');
                } else if (freshService.RespObject.UserType == surveyConstants.RespondentType.Coach) {
                    getResultResource = $resource('https://freshserver.herokuapp.com/coach/aggresults/:playerId');
                } else if (freshService.RespObject.UserType == surveyConstants.RespondentType.AthleticTrainer) {
                    getResultResource = $resource('https://freshserver.herokuapp.com/atc/aggresults/:playerId');
                }

                var userId = $cookies.get('SignedInUserId');
                getResultResource.query({ playerId: userId }, function (data) {
                    $scope.Survey = data;
                });
                if (freshService.RespObject.UserType == surveyConstants.RespondentType.Player) {
                    getAverageResultResource.query({ playerId: userId }, function (data) {
                        $scope.AverageSurveyAnswers = data;
                    })
                }
            }
        }

        //Function to apply Date Filter
        function showResult(date, month, year) {
            if ($scope.DateFilter == '') {
                return true;
            }
            if ($scope.DateFilter == 1) {
                if (date === new Date().getDate() - 1) {
                    return true;
                } else {
                    return false;
                }
            } else if ($scope.DateFilter == 2) {
                var today = new Date();
                var lastWeek = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
                var dateApplied = new Date(year, month, date);
                if (Date.parse(dateApplied) > lastWeek && Date.parse(dateApplied) < Date.parse(today)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (month == new Date().getMonth() - 1) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function applyDateFilter(dateFilter) {
            $scope.DateFilter = dateFilter;
        }

        //Function to remove filters
        function removeFilters(filterApplied) {
            if (!filterApplied) {
                for (var i = 1; i <= 8; i++) {
                    $scope.VisibleQuestion[i] = true;
                }
                $scope.DateFilter = '';
                showResult();
            }
        }

        function getIndividualPlayerDataForATC(playerId) {
            var getResultResource = $resource('https://freshserver.herokuapp.com/atc/:atcId/indresults/:playerId');
            var getAverageResultResource = $resource('https://freshserver.herokuapp.com/atc/aggresults/:playerId');
            var atcId = $cookies.get('SignedInUserId');
            var indResultObject = {};
            indResultObject.ATCId = atcId;
            indResultObject.PlayerId = playerId;
            getResultResource.query({ playerId: playerId, atcId: atcId }, function (data) {
                $scope.IndPlayerData = data;
            });
            getAverageResultResource.query({ playerId: atcId }, function (data) {
                $scope.AveragePlayerData = data;
            });
        }
    }
})(angular);
(function (angular) {

    "use strict";

    angular
        .module("FreshApp")
        .controller("Fresh.ATCController", ['$scope', '$resource', 'FreshApp.Service', 'FreshApp.Factory', 'Fresh.SurveyConstants', '$cookies', '$location', atcController]);

    function atcController($scope, $resource, freshService, freshFactory, surveyConstants, $cookies, $location) {

        //Public Variables
        $scope.respObject = freshService.RespObject;
        $scope.SurveyTime = freshService.SurveyType;

        $scope.RatingScale = ['0-Rest', '1-Very Easy', '2-Easy', '3-Moderate', '4-Somewhat Hard', '5-Hard', '6', '7-Very Hard', '8', '9', '10-Maximum'];
        $scope.AnsweredOption = '';
        $scope.respObject.answer = new freshFactory.Answer();
        $scope.respObject.answer.Date = {
            TodayDate: new Date().getDate(),
            TodayMonth: new Date().getMonth(),
            TodayYear: new Date().getFullYear()
        }
        $scope.PostATCAnswers = {};
        $scope.PendingNo = 0;
        $scope.Team = {
            Name: ''
        }

        //Public Functions
        $scope.ApprovePlayer = approvePlayer;
        $scope.GetTemplateUrl = getTemplateUrl;
        $scope.SaveAnswer = saveAnswer;
        $scope.SubmitRespondent = submit;
        $scope.SavePostATCAnswers = savePostATCAnswers;
        $scope.getPendingPlayersForATC = getPendingPlayersForATC;
        $scope.GetAllPlayersForATC = getAllPlayersForATC;
        $scope.ShowIndividualResult = showIndividualResult;
        $scope.AddNewTeam = addNewTeam;


        function getTemplateUrl(respObject) {
            if ($scope.SurveyTime == surveyConstants.TypeOfSurvey.PrePractice) {
                return "./app/components/ATC/ATC_Pre/Page1.html";
            } else {
                return "./app/components/ATC/ATC_Post/playerList.html";
            }
        }

        //Function to save the answers
        function saveAnswer(question, answer) {
            $scope.respObject.answer[question] = answer;
        }

        function submit() {
            // var resourceObject = $resource('');
            // resourceObject.$save();
            console.log($scope.respObject.answer);
            var currentUserId = $cookies.get('SignedInUserId');
            var currentUserType = $cookies.get('SignedInUserType');

            var atcSurveySubmitResource = $resource("https://freshserver.herokuapp.com/atc/survey");

            var surveyResponseObject = {};
            surveyResponseObject.answers = $scope.respObject.answer;

            if ($scope.SurveyTime == 1) {
                surveyResponseObject.surveyType = 5;
                surveyResponseObject.UserId = currentUserId;
                atcSurveySubmitResource.save(surveyResponseObject, function (data) {
                    console.log(data);
                });
            }
            console.log(surveyResponseObject);
        }

        function savePostATCAnswers(userId, answer) {
            $scope.PostATCAnswers[userId] = answer;
            $scope.respObject.answer['Q14'] = answer;
            var currentUserId = $cookies.get('SignedInUserId');
            var currentUserType = $cookies.get('SignedInUserType');
            var surveyResponseObject = {};

            surveyResponseObject = $scope.respObject.answer;
            //Survey response needs to have userId = coachId
            //and PlayerId = player's id whose rating is been given } - Shobhit
            surveyResponseObject.UserId = currentUserId;
            surveyResponseObject.PlayerId = userId;
            var atcSurveySubmitResource = $resource("https://freshserver.herokuapp.com/atc/survey");
            if (currentUserType == 3 && $scope.SurveyTime == 2) {
                surveyResponseObject.surveyType = 6;
                atcSurveySubmitResource.save(surveyResponseObject, function (data) {
                    console.log(data);
                });
            }
        }

        function getPendingPlayersForATC() {
            var getPlayerResource = $resource('https://freshserver.herokuapp.com/atc/pending/:atcId');
            var atcId = $cookies.get('SignedInUserId');
            getPlayerResource.query({ atcId: atcId }, function (players) {
                if (players.length > 0) {
                    $scope.PendingPlayers = players;
                    $scope.PendingPlayersBkUp = players;
                    $scope.PendingNo = 1;
                }
            });
        }

        function getAllPlayersForATC() {
            var getPlayerResource = $resource('https://freshserver.herokuapp.com/atc/allplayers/:atcId');
            var atcId = $cookies.get('SignedInUserId');
            getPlayerResource.query({ atcId: atcId }, function (players) {
                if (players.length > 0) {
                    $scope.AllPlayers = players;
                }
            });
        }

        function approvePlayer(playerId) {
            //Post request to approve the player
            var approvePlayerResource = $resource('https://freshserver.herokuapp.com/atc/approve');
            var atcId = $cookies.get('SignedInUserId');
            var approvePlayerObject = {};
            approvePlayerObject.PlayerId = playerId;
            approvePlayerObject.ATCId = atcId;
            approvePlayerResource.save(approvePlayerObject, function (data) {
                if (data.$resolved == true) {
                    for (var index in $scope.PendingPlayers)
                        if ($scope.PendingPlayers[index].UserId == playerId) {
                            $scope.PendingPlayers[index].StatusCd = 1;
                        }
                }
            });
        }

        function showIndividualResult(playerId) {
            window.location = '#IndividualAnswers?PlayerId=' + playerId;
        }

        function addNewTeam(){
            //Call to add team to the DB
        }
    }
})(angular);

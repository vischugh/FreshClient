(function (angular) {

    "use strict";

    angular
        .module("FreshApp")
        .controller("Fresh.SurveyController", ['$scope', '$cookies', 'Fresh.SurveyConstants', 'FreshApp.Service', '$resource', "FreshApp.Factory", '$location', flowController]);

    function flowController($scope, $cookies, surveyConstants, freshService, $resource, freshFactory, $location) {
        //Public Variables
        $scope.respObject = freshService.RespObject;
        $scope.SurveyTime = freshService.SurveyType;
        $scope.IsFirstPage = true;
        if ($scope.respObject.UserType == surveyConstants.RespondentType.Player &&
            $scope.SurveyTime == surveyConstants.TypeOfSurvey.PrePractice) {
            $scope.IsLastPage = false;
        } else {
            $scope.IsLastPage = true;
        }

        $scope.RatingScale = ['0-Rest', '1-Very Easy', '2-Easy', '3-Moderate', '4-Somewhat Hard', '5-Hard', '6', '7-Very Hard', '8', '9', '10-Maximum'];
        $scope.Page = 1;
        $scope.HideButtons = false;
        $scope.AnsweredOption = '';
        $scope.respObject.answer = new freshFactory.Answer();
        $scope.respObject.answer.Date = {
            TodayDate: new Date().getDate(),
            TodayMonth: new Date().getMonth(),
            TodayYear: new Date().getFullYear()
        }
        $scope.PostCoachAnswers = {};


        //Public Functions
        $scope.GetTemplateUrl = getTemplateUrl;
        $scope.Next = next;
        $scope.Back = back;
        $scope.SaveAnswer = saveAnswer;
        $scope.getAnswer = getAnswer;
        $scope.SubmitRespondent = submit;
        $scope.HideNavigationButtons = hideNavigationButtons;
        $scope.SavePostCoachAnswers = savePostCoachAnswers;
        $scope.getPlayersForCoach = getPlayersForCoach;
        $scope.ShowDurationQuestion = showDurationQuestion;
        $scope.ComparePracticeHardness = comparePracticeHardness;

        function getTemplateUrl(respObject) {
            switch (parseInt($scope.respObject.UserType)) {
                case surveyConstants.RespondentType.Player:
                    if ($scope.SurveyTime == surveyConstants.TypeOfSurvey.PrePractice) {
                        return "./app/components/Survey/views/Pre_Player/Page" + $scope.Page + ".html";
                    } else {
                        return "./app/components/Survey/views/Post_Player/Page" + $scope.Page + ".html";
                    }
                case surveyConstants.RespondentType.Coach:
                    if ($scope.SurveyTime == surveyConstants.TypeOfSurvey.PostPractice) {
                        return "./app/components/Survey/views/Post_Coach/playerList.html";
                    } else {
                        return "./app/components/Survey/views/Pre_Coach/Page" + $scope.Page + ".html";
                    }
            }
        }

        function next() {
            $scope.Page++;
            if ($scope.respObject.UserType == surveyConstants.RespondentType.Player &&
                $scope.SurveyTime == surveyConstants.TypeOfSurvey.PrePractice &&
                $scope.Page == 4) {
                $scope.IsLastPage = true;
            } else {
                $scope.IsLastPage = false;
            }
            $scope.IsFirstPage = false;
            getAnswer();
        }

        function back() {
            $scope.Page--;
            $scope.IsLastPage = false;
            if ($scope.Page == 1) {
                $scope.IsFirstPage = true;
            }
            getAnswer();
        }

        //Function to save the answers
        function saveAnswer(question, answer) {
            $scope.respObject.answer[question] = answer;
        }

        //Function to get the answer of question
        function getAnswer() {
            switch ($scope.Page) {
                case 1:
                    $scope.AnsweredValue = $scope.respObject.answer["Q1"];
                    $scope.AnsweredOption = $scope.respObject.answer["Q2"];
                    break;
                case 2:
                    $scope.AnsweredOption = $scope.respObject.answer["Q3"];
                    $scope.AnsweredOptions = $scope.respObject.answer["Q4"];
                    break;
                case 3:
                    $scope.AnsweredOption = $scope.respObject.answer["Q5"];
                    $scope.AnsweredValue = $scope.respObject.answer["Q6"];
                    break;
                case 4:
                    $scope.AnsweredValue = $scope.respObject.answer["Q7"];
                    $scope.AnsweredOption = $scope.respObject.answer["Q8"];
                    break;
            }
        }

        function submit() {
            // var resourceObject = $resource('');
            // resourceObject.$save();
            console.log($scope.respObject.answer);
            var currentUserId = $cookies.get('SignedInUserId');
            var currentUserType = $cookies.get('SignedInUserType');

            var playerSurveySubmitResource = $resource("https://freshserver.herokuapp.com/player/survey");
            var coachSurveySubmitResource = $resource("https://freshserver.herokuapp.com/coach/survey");

            var surveyResponseObject = {};
            surveyResponseObject.answers = $scope.respObject.answer;

            if (currentUserType == 1 && $scope.SurveyTime == 1) {
                surveyResponseObject.surveyType = 1;
                surveyResponseObject.UserId = currentUserId;
                playerSurveySubmitResource.save(surveyResponseObject, function (data) {
                    console.log(data);
                });
            }
            else if (currentUserType == 1 && $scope.SurveyTime == 2) {
                surveyResponseObject.surveyType = 2;
                surveyResponseObject.UserId = currentUserId;
                playerSurveySubmitResource.save(surveyResponseObject, function (data) {
                    console.log(data);
                });
            }
            else if (currentUserType == 2 && $scope.SurveyTime == 1) {
                surveyResponseObject.surveyType = 3;
                surveyResponseObject.UserId = Number(currentUserId);
                coachSurveySubmitResource.save(surveyResponseObject, function (data) {
                    console.log(data);
                });
            }
            console.log(surveyResponseObject);
            alert('Your answers has been stored');
            $location.path('/MainPage')
        }

        function hideNavigationButtons() {
            $scope.HideButtons = true;
        }

        function savePostCoachAnswers(userId, answer) {
            $scope.PostCoachAnswers[userId] = answer; //Do we need this? - Vishal
            $scope.respObject.answer['Q12'] = answer;
            var currentUserId = $cookies.get('SignedInUserId');
            var currentUserType = $cookies.get('SignedInUserType');
            var surveyResponseObject = {};

            surveyResponseObject = $scope.respObject.answer;
            //Survey response needs to have userId = coachId
            //and PlayerId = player's id whose rating is been given } - Shobhit
            surveyResponseObject.UserId = currentUserId;
            surveyResponseObject.PlayerId = userId;
            var coachSurveySubmitResource = $resource("https://freshserver.herokuapp.com/coach/survey");
            if (currentUserType == 2 && $scope.SurveyTime == 2) {
                surveyResponseObject.surveyType = 4;
                coachSurveySubmitResource.save(surveyResponseObject, function (data) {
                    console.log(data);
                });
            }
        }

        function getPlayersForCoach() {
            var getPlayerResource = $resource('https://freshserver.herokuapp.com/coach/allPlayers/:coachId');
            var coachId = $cookies.get('SignedInUserId');
            getPlayerResource.query({ coachId: coachId }, function (players) {
                console.log(players);
                $scope.Players = players;
                $scope.PlayersBkUp = players;
            });

        }

        function showDurationQuestion() {
            if ($scope.respObject.answer["Q15"] == 'no') {
                return true;
            } else {
                return false;
            }
        }

        function comparePracticeHardness() {
            $scope.CoachAnswer = $scope.respObject.answer['Q11'];
            var getPlayerResource = $resource('https://freshserver.herokuapp.com/coach/teampracticeavg/:coachId');
            var coachId = $cookies.get('SignedInUserId');
            getPlayerResource.query({ coachId: coachId }, function (players) {
                $scope.TeamAnswer = players[0].AvgQ9;
            });
        }
    }
})(angular);
(function (angular) {

    "use strict";

    angular
        .module("FreshApp")
        .controller("FreshApp.LoginController", ['$scope', '$location', '$http', '$resource', '$cookies', 'FreshApp.Service', loginController]);

    function loginController($scope, $location, $http, $resource, $cookies, freshService) {
        //Public Variables
        $scope.User = {
            username: "",
            password: ""
        };

        $scope.NewUser = {
            "email": '',
            "name": '',
            "password": '',
            "team": '',
            "usertype": 0
        };

        $scope.TypeOfSurvey = freshService.SurveyType;
        $scope.UserType = freshService.UserType;
        $scope.Status = freshService.Status;
        $scope.Teams = [];

        //Public Methods
        $scope.ValidateUser = validateUser;
        $scope.ChangeType = changeType;
        $scope.SignupUser = signupUser;
        $scope.OpenPage = openPage;
        $scope.Signup = signup;

        initialize();

        function initialize(){
            populateTeamDropdown();
        }

        function populateTeamDropdown(){
              //Get Teams from DB
        }

        function validateUser() {
            //Post call to validate user
            if ($scope.User.username == '' || $scope.User.password == '' || (!($scope.TypeOfSurvey == 1 || $scope.TypeOfSurvey == 2))) {
                alert('Login information incorrect or incomplete');
            }
            else {
                var SignedInUser = $scope.User.username;
                var loginStatus = $resource('https://freshserver.herokuapp.com/user/login');
                loginStatus.save($scope.User, function (data) {
                    freshService.RespObject = data;
                    freshService.UserType = data.UserType;
                    $scope.Status = freshService.Status = data.StatusCd;
                    console.log(data);
                    if (data.UserId > 0) {
                        $cookies.put('SignedInUserId', data.UserId);
                        $cookies.put('SignedInUserType', data.UserType);
                        $location.path('/MainPage');
                    }
                    else {
                        alert('Login Failed.Incorrect username or password')
                        $location.path('/');
                    }
                });
            }
        };

        function changeType() {
            freshService.SurveyType = $scope.TypeOfSurvey;
        };

        function signupUser() {
            console.log("Creating user.");
            var signupResrc = $resource('https://freshserver.herokuapp.com/user/signup');
            signupResrc.save($scope.NewUser, function (data) {
                console.log(data);
                alert("You have signed up successfuly. Please login to continue");
                $location.path('/');
            });
            /*$http({
             method:'POST',
             url:'https://freshserver.herokuapp.com/user/signup',
             data:$scope.NewUser,
             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
             }).success(function(data){
             console.log(data);
             });*/
        };

        function openPage(type) {
            if (type == 'survey') {
                $location.path('/Survey');
            } else if (type == 'atcSurvey') {
                $location.path('/ATCSurvey');
            } else if (type == 'result') {
                $location.path('/Results');
            } else if (type == 'individualPlayerResults') {
                $location.path('/IndividualAnswers')
            } else if (type == 'atcPlayers') {
                $location.path('/ATCPlayers');
            } else if (type == 'calendar') {
                $location.path('/Calendar');
            }else if (type == 'newTeam') {
                $location.path('/AddTeam');
            }else {
                $location.path('/ApprovePlayers');
            }
        }

        function signup() {
            $location.path('/Signup');
        }
    }
})(angular);

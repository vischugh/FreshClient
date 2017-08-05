(function (angular) {
    "use strict";

    angular
        .module('FreshApp')
        .controller('FreshApp.CalendarController', ['$scope', '$cookies', '$resource', 'Fresh.SurveyConstants', 'FreshApp.Service', calendarController]);

    function calendarController($scope, $cookies, $resource, surveyConstants, freshService) {

        $scope.TeamInvites = [];

        $scope.HandleClientLoad = handleClientLoad;
        $scope.AddPracticeDate = addPracticeDate;
        $scope.EventDescription = "";

        // Client ID and API key from the Developer Console
        var CLIENT_ID = '779417370423-q3mhvl4nunt5htnp5ja6mk87i2md0i7m.apps.googleusercontent.com';

        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var SCOPES = "https://www.googleapis.com/auth/calendar";

        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');
        var addEventButton = document.getElementById('addevent-button');

        /**
         *  On load, called to load the auth2 library and API client library.
         */
        function handleClientLoad() {
            gapi.load('client:auth2', initClient);
        }

        function initClient() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
                addEventButton.onclick = addEvent;
                getTeamMembers();
            });
        }

        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                authorizeButton.style.display = 'none';
                addEventButton.style.display = 'block';
                signoutButton.style.display = 'block';
                listUpcomingEvents();
            } else {
                authorizeButton.style.display = 'block';
                addEventButton.style.display = 'none';
                signoutButton.style.display = 'none';
            }
        }

        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
        }

        /**
         *  Sign out the user upon button click.
         */
        function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        }

        function appendPre(message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
        }

        //Add practice event
        function addEvent() {
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': $scope.Event
            });

            request.execute(function (event) {
                if (event.code == 400) {
                    alert('Some error occured in inviting team members. Please try again.');
                } else {
                    appendPre('Event created: ' + event.htmlLink);
                }
            }, function (err) {
                alert('Some error occured in inviting team members. Please try again.');
            });
        }

        function listUpcomingEvents() {
            gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            }).then(function (response) {
                var events = response.result.items;
                appendPre('Upcoming events:');

                if (events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        var event = events[i];
                        var when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                        }
                        appendPre(event.summary + ' (' + when + ')')
                    }
                } else {
                    appendPre('No upcoming events found.');
                }
            });
        }

        function addPracticeDate(date) {
            $scope.Event = {
                'summary': $scope.EventDescription,
                'description': $scope.EventDescription,
                'start': {
                    'dateTime': date,
                    'timeZone': 'America/Los_Angeles'
                },

                'end': {
                    'dateTime': new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                    'timeZone': 'America/Los_Angeles'
                },
                'attendees': $scope.TeamInvites
            };
        }

        function getTeamMembers() {
            var getPlayerResource;
            var id = $cookies.get('SignedInUserId');
            if (freshService.RespObject.UserType == surveyConstants.RespondentType.Coach) {
                getPlayerResource = $resource('https://freshserver.herokuapp.com/coach/allPlayers/:id');
            } else {
                getPlayerResource = $resource('https://freshserver.herokuapp.com/atc/allPlayers/:id')
            }

            getPlayerResource.query({ id: id }, function (players) {
                console.log(players);
                $scope.Players = players;

                for (var i = 0; i < $scope.Players.length; i++) {
                    var player = {
                        'email': $scope.Players[i].Email
                    }
                    $scope.TeamInvites.push(player);
                }
            });
        }
    }
})(angular);
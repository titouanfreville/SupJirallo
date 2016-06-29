// ProductOwner
'use strict';
var jirallo = angular.module('jirallo.tickets', ['ngCookies']);
jirallo.controller('detailsTicket', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', 'Comment', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket, Comment){
  var summary=$rootScope.ticket=$window.sessionStorage.ticket;
  $scope.ticket=Ticket.$get({summary: summary});
  $scope.comments=Comment.$query({ticket: summary}, null, {sort: {creationDate: -1}});
  console.log($scope.ticket);
  $scope.go_details = function(ticket) {
    console.log(ticket);
    $rootScope.ticket=ticket;
    $state.go('details');
  }
}]);


jirallo.controller('newTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket){
  $scope.tickets=Ticket.$query({status: 'TO DO'}, null, {sort: {creationDate: -1}});
  $scope.go_details = function(ticket) {
    console.log(ticket);
    $rootScope.ticket=ticket;
    $state.go('details');
  }
}]);

jirallo.controller('allTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket){
  $scope.tickets=Ticket.$query({}, null, {sort: {creationDate: -1}});
  $scope.go_details = function(ticket) {
    console.log(ticket);
    $rootScope.ticket=ticket;
    $window.sessionStorage.ticket = ticket;
    $state.go('details');
  }
}]);

jirallo.controller('addTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', function($scope, $rootScope, $state, $window, $http, $location){
  var CredNotProvided = "You are missing something. Please make sure you provided a Summary for the ticket.";
  $scope.priorities= {
    'type': 'select',
    'name': 'Priority',
    'value': 'Major',
    'values': ['Trivial', 'Minor', 'Major', 'Critical', 'Blocker'] };
  $scope.submit = function () {
    if ($scope.summary) {
      $http({
        method: 'POST',
        url: '/private/newticket',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {
          summary: $scope.summary ,
          description: $scope.description,
          priority: $scope.priorities.value,
          status: 'TO DO'
        }
      }).success(function(res) {
        $window.alert(res.message);
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
}]);

jirallo.controller('updateTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', function($scope, $rootScope, $state, $window, $http, $location){
  var CredNotProvided = "You are missing something. Please make sure you provided a Summary for the ticket.";
  if ($rootScope.ticketName) $scope.ticketName = $rootScope.ticketName;
  else {
    if ($window.sessionStorage.ticketName) $scope.ticketName = $window.sessionStorage.ticketName;
    else {
      $window.alert('No ticket available to work on. Please make sure you arrive here well ^^.');
      $state.go('logged');
    }
  }
  $scope.priorities= {
    'type': 'select',
    'name': 'Priority',
    'value': 'Major',
    'values': ['Trivial', 'Minor', 'Major', 'Critical', 'Blocker'] };
  $scope.status= {
    'type': 'select',
    'name': 'Priority',
    'value': $rootScope.ticketStatus,
    'values': ['Trivial', 'Minor', 'Major', 'Critical', 'Blocker'] };
  $scope.submit = function () {
    if ($scope.summary) {
      $http({
        method: 'POST',
        url: '/private/newticket',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {
          summary: $scope.summary ,
          description: $scope.description,
          priority: $scope.priorities.value,
          status: 'TO DO'
        }
      }).success(function(res) {
        $window.alert(res.message);
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
}]);


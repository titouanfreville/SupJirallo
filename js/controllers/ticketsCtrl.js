// ProductOwner
'use strict';
var jirallo = angular.module('jirallo.tickets', ['ngCookies']);

jirallo.controller('newTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket){
  $scope.tickets=Ticket.$query({status: 'TO DO'});
  console.log(Ticket.$get({status: 'TO DO'}));
  $scope.useractions = '<a ui-sref="details">View</a>';
  if ($window.localStorage.userRole == 'ProductOwner') {
    $scope.useractions =$scope.useractions + (' | <a ui-sref="editticket">Edit Ticket</a> | <button ng-click="destroy()">Delete Ticket</button>')
  }
  $scope.useractions = $sce.trustAsHtml($scope.useractions);
}]);

jirallo.controller('addTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', function($scope, $rootScope, $state, $window, $http, $location){
  var CredNotProvided = "You are missing something. Please make sure you provided a Summary for the ticket.";
  $scope.priorities= {
    'type': 'select',
    'name': 'Priority',
    'value': 'Major',
    'values': ['Trivial', 'Minor', 'Major', 'Critical', 'Blocker'] };
  $scope.submit = function () {
    console.log('In submit');
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


// ProductOwner
'use strict';
var jirallo = angular.module('jirallo.tickets', ['ngDialog']);
jirallo.controller('detailsTicket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket, Comment, ngDialog){

  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);

  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');

  var summary=$rootScope.summary=$window.sessionStorage.summary;
  $scope.ticket=Ticket.$get({summary: summary});
  $scope.comments=Comment.$query({ticket: summary}, null, {sort: {creationDate: -1}});
  $scope.ngDialog = ngDialog;
  $scope.userName = $window.sessionStorage.userName;
  $scope.base_state = $state.current.name;
  $scope.state=$state;
  console.log($scope.comment);
  $scope.add_comment = function() {
    console.log("ready"),
    ngDialog.open({
      template: 'private/addcomment.html',
      controller: 'commentCtrl',
      scope: $scope,
      closeByNavigation: true,
      closeByDocument: false,
      closeByEscape: true,
      className: 'ng-dialog-theme-default'
    });
  }

  $scope.go_edit = function(summary) {
    $rootScope.summary=summary;
    $rootScope.previous_state='listtickets'
    $window.sessionStorage.summary = summary;
    $state.go('edit');
  }

  $scope.destroy = function(summary) {
    $http({
      method: 'POST',
      url: '/private/deleteticket',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {
        summary: summary
      }
    }).success(function(res) {
      $window.alert(res.message);
      $state.reload($state.current.name);
    });;
  };

  $scope.start_working  = function(){
    console.log(summary);
    $http({
      method: 'POST',
      url: '/private/startworking',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {
        ticket_name: summary
      }
    }).success(function(res) {
      $window.alert(res.message);
      $state.reload($state.current.name);
    });;
  }

  $scope.stop_working  = function(status){
    $http({
      method: 'POST',
      url: '/private/stopworking',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {
        ticket_name: summary,
        status: status
      }
    }).success(function(res) {
      $window.alert(res.message);
      $state.reload($state.current.name);
    });;
  }
})

jirallo.controller('newTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket){

  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);
  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');

  $scope.tickets=Ticket.$query({status: 'TO DO'}, null, {sort: {creationDate: -1}});
  $scope.orderPlace= $rootScope.orderPlace;
  $scope.order_by = function (value) {
    if ($rootScope.orderPlace == value) $rootScope.orderSens = $rootScope.orderSens * -1;
    else {$rootScope.orderPlace = value; $rootScope.orderSens=1;}
    if ($rootScope.orderSens < 0 ) $rootScope.orderPlace = '-'+$rootScope.orderPlace ;
    $state.reload($state.current.name);
  }
  $scope.go_details = function(summary) {
    $rootScope.summary=summary;
    $window.sessionStorage.summary = summary;
    $state.go('details');
  }
  $scope.go_edit = function(summary) {
    $rootScope.summary=summary;
    $rootScope.previous_state='listtickets'
    $window.sessionStorage.summary = summary;
    $state.go('edit');
  }
  $scope.destroy = function(summary) {
    $http({
      method: 'POST',
      url: '/private/deleteticket',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {
        summary: summary
      }
    }).success(function(res) {
      $window.alert(res.message);
      $state.reload($state.current.name);
    });;
  };
}]);

jirallo.controller('myTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket){

  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);
  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');

  if ($window.sessionStorage.userRole == 'ProductOwner') $scope.tickets=Ticket.$query({reporter: $window.sessionStorage.userName}, null, {sort: {creationDate: -1}});
  else $scope.tickets=Ticket.$query({assignee: $window.sessionStorage.userName}, null, {sort: {creationDate: -1}});
  $rootScope.orderSens=1;

  $scope.order_by = function (value) {
    if ($rootScope.orderPlace == value) $rootScope.orderSens = $rootScope.orderSens * -1;
    else {$rootScope.orderPlace = value; $rootScope.orderSens=1;}
    if ($rootScope.orderSens < 0 ) $rootScope.orderPlace = '-'+$rootScope.orderPlace ;
    $state.reload($state.current.name);
  }
  $scope.go_details = function(summary) {
    $rootScope.summary=summary;
    $window.sessionStorage.summary = summary;
    $state.go('details');
  }
  $scope.go_edit = function(summary) {
    $rootScope.summary=summary;
    $rootScope.previous_state='listtickets'
    $window.sessionStorage.summary = summary;
    $state.go('edit');
  }
  $scope.destroy = function(summary) {
    $http({
      method: 'POST',
      url: '/private/deleteticket',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {
        summary: summary
      }
    }).success(function(res) {
      $window.alert(res.message);
      $state.reload($state.current.name);
    });;
  };
}]);


jirallo.controller('allTicketCtrl', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', '$sce', 'Ticket', function($scope, $rootScope, $state, $window, $http, $location, $sce, Ticket){

  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);
  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');

  $scope.tickets=Ticket.$query({}, null, {sort: {creationDate: -1}});
    $scope.order_by = function (value) {
    if ($rootScope.orderPlace == value) $rootScope.orderSens = $rootScope.orderSens * -1;
    else {$rootScope.orderPlace = value; $rootScope.orderSens=1;}
    if ($rootScope.orderSens < 0 ) $rootScope.orderPlace = '-'+$rootScope.orderPlace ;
    $state.reload($state.current.name);
  }
  $scope.go_details = function(summary) {
    $rootScope.summary=summary;
    $window.sessionStorage.summary = summary;
    $state.go('details');
  }
  $scope.go_edit = function(summary) {
    $rootScope.summary=summary;
    $rootScope.previous_state='listtickets'
    $window.sessionStorage.summary = summary;
    $state.go('edit');
  }
  $scope.destroy = function(summary) {
    $http({
      method: 'POST',
      url: '/private/deleteticket',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
      },
      data: {
        summary: summary
      }
    }).success(function(res) {
      $window.alert(res.message);
      $state.reload($state.current.name);
    });;
  };
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
       $state.reload($state.current.name);
      });
    } else {
      $window.alert(CredNotProvided);
      $state.reload($state.current.name);
    }
  }
}]);

jirallo.controller('updateTicketCtrl', function($scope, $rootScope, $state, $window, $http, $location, Ticket){
  var CredNotProvided = "You are missing something. Please make sure you provided a Summary for the ticket.";
  var summary
  if ($rootScope.summary) summary = $rootScope.summary;
  else {
    if ($window.sessionStorage.summary) $scope.summary = $window.sessionStorage.summary;
    else {
      $window.alert('No ticket available to work on. Please make sure you arrive here well ^^.');
      $state.go('logged');
    }
  }
  var previous_state
  if ($rootScope.previous_state) previous_state=$rootScope.previous_state;
  else previous_state = 'edit'
  console.log($rootScope.previous_state)
  console.log(previous_state);
  $scope.ticket=Ticket.$get({summary: summary});
  $scope.priorities= {
    'type': 'select',
    'name': 'Priority',
    'values': ['Trivial', 'Minor', 'Major', 'Critical', 'Blocker'] };
  $scope.status= {
    'type': 'select',
    'name': 'Priority',
    'values': ['TO DO', 'IN PROGRESS', 'DONE'] };
  $scope.submit = function () {
    if ($scope.summary) {
      $http({
        method: 'POST',
        url: '/private/updateticket',
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
          priority: $scope.ticket.priority,
          status: $scope.ticket.status
        }
      }).success(function(res) {
        $window.alert(res.message);
        $state.go(previous_state);
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
});


/**
* @ngdoc overview
* @name InApp Billing Module
* @author Christophe Eble <ceble@nexway.com>
* @author Titouan Freville <tfreville@nexway.com>
* @description Main module for InApp Billing
*
* @usage
*
* ```
* #/{GUID}
* ```
*/
/* jshint +W097 */
'use strict';
/*jshint -W097 */
var jirallo=angular.module('jirallo', [ 'ngRoute', 'ui.router', 'angoose.client' ,'jirallo.loginCtrl', 'jirallo.tickets', 'jirallo.comment']);
// State navigation for angular.
// Config require $stateProvider and $urlRouterProvider
jirallo.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    // Index stats. Will load login form with mainCtrl
    .state('jiralo', {
      url: '',
      controller: 'mainCtrl',
      templateUrl: 'main_view.html'
     })
    // Index stats for navigation use.
    .state('index', {
      url: '/index',
      controller: 'mainCtrl',
      templateUrl: 'main_view.html'
    })
    // Logged Stat => first state when logged.
    // State to list new tickets. Can't be acced if not logged
    .state('logged', {
      url: '/logged',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'newTicketCtrl',
      templateUrl: 'private/show.html'
    })
    // List Sticket state
    // State to list all tickets. Can't be acced if not logged
    .state('listtickets', {
      url: '/listtickets',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'allTicketCtrl',
      templateUrl: 'private/show.html'
    })
    // My Tickets state
    // State to list all tickets. Can't be acced if not logged
    .state('mytickets', {
      url: '/mytickets',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'myTicketCtrl',
      templateUrl: 'private/show.html'
    })
    // Details ticket state
    // State to show détails of tickets. Can't be acced if not logged
    .state('details', {
      url: '/details',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/details.html'
    })
    // Add ticket state
    // State to add ticket. Can't be acced if not logged
    .state('addticket', {
      url: '/addticket',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
        var ispo;
        if ($rootScope.userRole) ispo = ($rootScope.userRole == 'ProductOwner')
        else {
          if ($window.sessionStorage.userName) ispo = ($window.sessionStorage.userRole == 'ProductOwner');
        }
        console.log(ispo);
        if (ispo == false) {
          $window.alert('You are not allowed to access this space');
          $state.go('logged');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/add.html'
    })
    // Edit ticket state
    // State to edit a specific ticket. Can't be acced if not logged
    .state('edit', {
      url: '/edit',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
        var ispo;
        if ($rootScope.userRole) ispo = ($rootScope.userRole == 'ProductOwner')
        else {
          if ($window.sessionStorage.userName) ispo = ($window.sessionStorage.userRole == 'ProductOwner');
        }
        console.log(ispo);
        if (ispo == false) {
          $window.alert('You are not allowed to access this space');
          $state.go('logged');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/edit.html'
    })
  ;
  // Route to index by default when others failled. 
  $urlRouterProvider.otherwise('/index');
})
// Main Controller
// Used on all view to check if user is define && if user is ProductOwner
jirallo.controller('mainCtrl',['$rootScope', '$scope', '$window', '$state', function($rootScope, $scope, $window, $state) {
  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);
  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');
}]);
// Logout controller. Call the logout server session and remove sessionStorage && rootScope stored user value.
jirallo.controller('logoutCtrl', ['$scope', '$window', '$rootScope', '$state', '$http', function($scope, $window, $rootScope, $state, $http) {
  $scope.destroy = function() {
    $rootScope.userName=null;
    $rootScope.userRole=null;
    $window.sessionStorage.clear();
    $http({
      method: 'POST',
      url: '/destroy_session'
    }).success(function(res){
      $window.alert(res.message);
      $state.go('index');
    })
  }
}])
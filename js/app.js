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
var jirallo=angular.module('jirallo', [ 'ngRoute', 'ui.router', 'angoose.client' ,'jirallo.loginCtrl', 'jirallo.tickets']);
jirallo.config(function ($stateProvider, $urlRouterProvider, $routeProvider) {
  // $urlRouterProvider.when('/', '/index').when('/index.html', '/index');
  $stateProvider
    // Main State
    .state('jiralo', {
      url: '',
      templateUrl: 'main_view.html'
     })

  .state('index', {
      url: '/index',
      templateUrl: 'main_view.html'
    })

  .state('logged', {
      url: '/logged',
      templateUrl: 'private/index.html'
    })

  .state('listtickets', {
    url: '/listtickets',
    templateUrl: 'private/show.html'
  })

  .state('addticket', {
    url: '/addticket',
    templateUrl: 'po/add.html'
  })
  ;

  $urlRouterProvider.otherwise('/index')
})

jirallo.controller('mainCtrl',['$rootScope', '$scope', '$window', '$state', function($rootScope, $scope, $window, $state) {
  if ($rootScope.userName) {
    $scope.userName = $rootScope.userName;
  } else {
    $scope.userName = $window.localStorage.userName;
  }
  console.log($scope.userName);
  console.log(angular.isDefined($scope.userName));
  $scope.logged = angular.isDefined($scope.userName);
  console.log('logged ' + $scope.logged);

}]);

jirallo.controller('logoutCtrl', ['$scope', '$window', '$rootScope', '$state', function($scope, $window, $rootScope, $state) {
  $scope.destroy = function() {
    $rootScope.userName=null;
    $window.localStorage.clear();
    $state.go('index');
  }
}])
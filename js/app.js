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
var jirallo = angular.module('irallo', ['User'])

// .config(function ($stateProvider, $urlRouterProvider, settings) {

//   // IAB uses AngularUI Router which uses the concept of states
//   // @see https://github.com/angular-ui/ui-router
//   // Set up the various states which the app can be in.
//   // Each state's controller can be found in controllers.js

//   $stateProvider
//     // Main state
//     .state('iab', {
//       url: '/config/{token:[a-z0-9-]{36}}/country/{country:[a-z]{2}}/sku/:sku?option',
//       controller: 'MainCtrl',
//       resolve: {
//         $config: function($iabService, $stateParams) {
//           var params = [$stateParams.token, $stateParams.country, $stateParams.sku];
//           if ($stateParams.option) {
//             params.push($stateParams.option);
//           }
//           return $iabService.loadConfig.apply(null, params);
//         }
//       },
//       templateUrl: 'views/main.html'
//     })

//     // Child state autorenewal
//     .state('iab.renew', {
//       url: '/renew',
//       templateUrl: 'views/subscription.html'
//     })

//     // Child state card verification value
//     .state('iab.cvc', {
//       url: '/cvc',
//       templateUrl: 'views/cvc.html'
//     })

//     // Child state terms and conditions
//     .state('iab.terms', {
//       url: '/terms',
//       onEnter: function($iabService) {
//         $iabService.scrollToAnchor('top');
//       },
//       onExit: function($iabService) {
//         $iabService.scrollToAnchor('bottom');
//       },
//       templateUrl: function($stateParams) {
//         var baseUrl = 'views/terms/',
//             country = $stateParams.country;
//         switch (country) {
//           case 'br':
//           case 'fr':
//             return baseUrl + country + '.html';
//           default:
//             return baseUrl + 'default.html';
//         }
//       }
//     })

//     // Success state
//     .state('success', {
//       url: '/success/:orderId',
//       templateUrl: 'views/success.html',
//       controller: function($scope, $stateParams) {
//         $scope.orderId = $stateParams.orderId;
//       }
//     });
//   // if none of the above states are matched, use index as fallback
//   $urlRouterProvider.otherwise('/');
// })

/**
 * @ngdoc directive
 * @name iab.directive.next
 *
 * @requires iab
 *
 * @restrict A
 *
 * @description
 * The directives gives the focus to the next input
 * if ng model validates, fields must have a tabindex attribute
 *
 * @example
 * <pre>
 * <input tabindex="2" next>
 * </pre>
 */
// .directive('next', [
//   '$parse',
//   function($parse) {
//     return {
//       restrict: 'A',
//       require: ['ngModel'],
//       link: function(scope, element, attrs, ctrls) {
//         var model = ctrls[0],
//             form  = ctrls[1];

//         scope.next = function() {
//           return model.$valid;
//         };

//         scope.$watch(scope.next, function(newValue, oldValue) {
//           if (newValue && model.$dirty) {
//             var next = document.querySelector('[tabindex="'+ (element[0].tabIndex + 1) +'"]');
//             if (next) {
//               next.focus();
//               // Softkeyboard takes some time to display, take it into account.
//               setTimeout(function() {
//                 window.scrollTo(0, next.offsetTop - 100);
//               }, 300);
//             }
//           }
//         });
//       }
//     };
//   }
// ])

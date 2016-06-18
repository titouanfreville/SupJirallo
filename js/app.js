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
var $iab = angular.module('iab', [
  // Angular/Libraries
  'ngTouch', 'ui.router', 'gettext',
  // Iab Modules/Controllers
  'iab.payment', 'iab.address', 'iab.service',
  'iab.controller', 'iab.tracking', 'iab.config'
])
.constant('IAB_CONSTANT', {
  // Eurozone "special" country
  EURO_ZONE: 'eur',
  // Country served as fallback
  FALLBACK_COUNTRY: 'us'
})
.constant('IAB_EVENT', {
  // Fires when configuration is loaded
  LOAD_SUCCESS:                 'loadSuccess',
  // Fires when configuration cannot be loaded
  LOAD_FAILURE:                 'loadFailure',
  // Fires when translation file is loaded
  TRANSLATION_LOADED:           'translationLoaded',
  // Fires when CVC is displayed
  CVC_DISPLAYED:                'cvcDisplayed',
  // Fires when subscription is displayed
  SUBSCRIPTION_DISPLAYED:       'subscriptionDisplayed',
  // Fires when T&C are displayed
  TERMS_DISPLAYED:              'termsDisplayed',
  // Fires right before purchase
  BEFORE_PURCHASE:              'beforePurchase',
  // Fires right after purchase
  AFTER_PURCHASE:               'afterPurchase',
  // Fires after a successful purchase is made
  PURCHASE_SUCCESS:             'purchaseSuccess',
  // Fires after a failed purchase is made
  PURCHASE_FAILURE:             'purchaseFailure',
  // Fires after an invalid cc is entered
  UNSUPPORTED_CREDIT_CARD:      'unsupportedCreditCard',
  // Fires when subscription state changes
  SUBSCRIPTION_STATE_CHANGE:    'subscriptionStateChange'
})
.config(function ($stateProvider, $urlRouterProvider, settings) {

  // IAB uses AngularUI Router which uses the concept of states
  // @see https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider
    // Main state
    .state('iab', {
      url: '/config/{token:[a-z0-9-]{36}}/country/{country:[a-z]{2}}/sku/:sku?option',
      controller: 'MainCtrl',
      resolve: {
        $config: function($iabService, $stateParams) {
          var params = [$stateParams.token, $stateParams.country, $stateParams.sku];
          if ($stateParams.option) {
            params.push($stateParams.option);
          }
          return $iabService.loadConfig.apply(null, params);
        }
      },
      templateUrl: 'views/main.html'
    })

    // Child state autorenewal
    .state('iab.renew', {
      url: '/renew',
      templateUrl: 'views/subscription.html'
    })

    // Child state card verification value
    .state('iab.cvc', {
      url: '/cvc',
      templateUrl: 'views/cvc.html'
    })

    // Child state terms and conditions
    .state('iab.terms', {
      url: '/terms',
      onEnter: function($iabService) {
        $iabService.scrollToAnchor('top');
      },
      onExit: function($iabService) {
        $iabService.scrollToAnchor('bottom');
      },
      templateUrl: function($stateParams) {
        var baseUrl = 'views/terms/',
            country = $stateParams.country;
        switch (country) {
          case 'br':
          case 'fr':
            return baseUrl + country + '.html';
          default:
            return baseUrl + 'default.html';
        }
      }
    })

    // Success state
    .state('success', {
      url: '/success/:orderId',
      templateUrl: 'views/success.html',
      controller: function($scope, $stateParams) {
        $scope.orderId = $stateParams.orderId;
      }
    });
  // if none of the above states are matched, use index as fallback
  $urlRouterProvider.otherwise('/');
})

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
.directive('next', [
  '$parse',
  function($parse) {
    return {
      restrict: 'A',
      require: ['ngModel'],
      link: function(scope, element, attrs, ctrls) {
        var model = ctrls[0],
            form  = ctrls[1];

        scope.next = function() {
          return model.$valid;
        };

        scope.$watch(scope.next, function(newValue, oldValue) {
          if (newValue && model.$dirty) {
            var next = document.querySelector('[tabindex="'+ (element[0].tabIndex + 1) +'"]');
            if (next) {
              next.focus();
              // Softkeyboard takes some time to display, take it into account.
              setTimeout(function() {
                window.scrollTo(0, next.offsetTop - 100);
              }, 300);
            }
          }
        });
      }
    };
  }
])

/**
 * @ngdoc directive
 * @name iab.directive.highlightOnChange
 *
 * @requires iab
 *
 * @restrict A
 *
 * @description
 * The directives listens for changes in the model property passed in argument
 * and triggers CSS transition through adding and removing a class. works only with boolean values
 *
 * @example
 * <pre>
 * ... highlight-on-change="{{model_property}}"
 * </pre>
 */
.directive('highlightOnChange', function() {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {
      var id = element.attr('id');
      attrs.$observe('highlightOnChange', function(model) {
        scope.$watch(model, function(newValue, oldValue) {
          if (newValue !== oldValue) {
            setTimeout(function() {
              element = angular.element(document.getElementById(id));
              element.addClass('highlight').on('transitionend', function() {
                element.removeClass('highlight');
              });
            }, 50);
          }
        });
      });
    }
  };
});
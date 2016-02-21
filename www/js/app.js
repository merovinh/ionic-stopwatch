angular.module('Stopwatch', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("StopwatchCtrl", function( $scope ) {
  
  if( !angular.isUndefined( window.localStorage['laps'] ) ) {
    $scope.laps = JSON.parse( window.localStorage['laps'] );
  } else {
    $scope.laps = [
      { millisecond: '15230', description: 'first player' },
      { millisecond: '25330', description: 'second player' }
    ];
    updateStorage();
  }
  
  $scope.$watch('laps', function() { updateStorage() }, true);
  
  $scope.play = function() {
    console.log("Start time playing");
  }
  
  $scope.removeLap = function(id) {
    $scope.laps.splice(id, 1);
    updateStorage();
  }
  
  function updateStorage() {
    window.localStorage['laps'] = angular.toJson( $scope.laps );
  }
  
})

.directive('stopWatch', function(dateFilter, $interval) {
  return {
    restrict: 'E',
    replace: false,
    templateUrl: 'StopWatch',
    scope: {},
    link: function(scope, element, attrs, ctrl) {},
    controllerAs: 'swctrl',
    controller: function($scope, $interval) {
      var self = this;
      var totalElapsedMs = 0;
      var elapsedMs = 0;
      var startTime;
      var timerPromise;
      
      self.start = function() {
        if (!timerPromise) {
          startTime = new Date();
          timerPromise = $interval(function() {
            var now = new Date();
            //$scope.time = now;
            elapsedMs = now.getTime() - startTime.getTime();
          }, 31);
        }
      };
      
      self.stop = function() {
        if (timerPromise) {
          $interval.cancel(timerPromise);
          timerPromise = undefined;
          totalElapsedMs += elapsedMs;
          elapsedMs = 0;
        }
      };
      
      self.reset = function() {
        startTime = new Date();
        totalElapsedMs = elapsedMs = 0;
      };
      
      self.getElapsedMs = function() {
        //var timeToShow = totalElapsedMs + elapsedMs;
        //slice(-5);
        return dateFilter(totalElapsedMs + elapsedMs, "mm:ss.sss").slice(0,8);
      };
    }
  }
})
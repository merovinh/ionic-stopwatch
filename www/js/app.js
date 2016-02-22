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

.directive('stopWatch', function(dateFilter, $interval) {
  return {
    restrict: 'E',
    replace: false,
    templateUrl: 'StopWatch',
    scope: {},
    controllerAs: 'swctrl',
    controller: function($scope, $interval) {
      var self = this,
        _var = window.localStorage,
        totalElapsedMs = _var.totalElapsedMs ? parseInt(_var.totalElapsedMs) : 0,
        elapsedMs = 0;
      $scope.timerPromise = _var.timerPromise ? JSON.parse(_var.timerPromise) : "";
      
      $scope.laps = window.localStorage['laps'] ? JSON.parse( window.localStorage['laps'] ) : [];

      $scope.$watch('laps', function() { updateStorage() }, true);
      
      // start from reload
      if ( $scope.timerPromise ) {
        $scope.timerPromise = $interval(function() {
          var now = new Date();
          elapsedMs = now.getTime() - new Date(_var.startTime).getTime();
        }, 10);
        _var.timerPromise = JSON.stringify($scope.timerPromise);
      }
      
      self.start = function() {
        if (!$scope.timerPromise) {
          _var.startTime = new Date();
          $scope.timerPromise = $interval(function() {
            var now = new Date();
            elapsedMs = now.getTime() - new Date(_var.startTime).getTime();
          }, 10);
          _var.timerPromise = JSON.stringify($scope.timerPromise);
        }
      };
      
      self.stop = function() {
        if ($scope.timerPromise) {
          $interval.cancel($scope.timerPromise);
          _var.timerPromise = $scope.timerPromise = "";
          totalElapsedMs = _var.totalElapsedMs = totalElapsedMs + elapsedMs;
          elapsedMs = 0;
        }
      };
      
      self.lap = function() {
        if ( (totalElapsedMs + elapsedMs) == 0 ) return;
        $scope.laps.push({ time: dateFilter(totalElapsedMs + elapsedMs, "mm:ss.sss").slice(0,8), description: '' });
        updateStorage();
      }
      
      self.reset = function() {
         _var.startTime = new Date();
        totalElapsedMs = elapsedMs = 0;
        _var.totalElapsedMs = "";
        $scope.laps = [];
        updateStorage();
      };
      
      self.getElapsedMs = function() {
        return (totalElapsedMs + elapsedMs) % 1000 < 500 ? 
          dateFilter(totalElapsedMs + elapsedMs, "mm ss sss").slice(0,8) : 
          dateFilter(totalElapsedMs + elapsedMs, "mm:ss.sss").slice(0,8);
      };
      
      self.removeLap = function(id) {
        $scope.laps.splice(id, 1);
        updateStorage();
      }
      
      function updateStorage() {
        window.localStorage['laps'] = angular.toJson( $scope.laps );
      }
    }
  }
})
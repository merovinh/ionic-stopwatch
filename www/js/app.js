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
  
  $scope.newLap = "lap";

    $scope.$watch('newLap', function() {
        console.log("watch works");
    },true);
    
  //$scope.$watch(attrs.newLap, function(value) { console.log("add new lap "+value) }, true);
  
  $scope.$watch('laps', function() { updateStorage() }, true);
  
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
    scope: {
      lapAttr: "="
    },
    link: function($scope, element, attrs, ctrl) {},
    controllerAs: 'swctrl',
    controller: function($scope, $interval) {
      var self = this;
      var _var = window.localStorage;
      var totalElapsedMs = _var.totalElapsedMs ? parseInt(_var.totalElapsedMs) : 0;
      var elapsedMs = 0;
      var timerPromise = _var.timerPromise ? JSON.parse(_var.timerPromise) : "";
      
      // start from reload
      if ( timerPromise ) {
        timerPromise = $interval(function() {
          var now = new Date();
          elapsedMs = now.getTime() - new Date(_var.startTime).getTime();
        }, 31);
        _var.timerPromise = JSON.stringify(timerPromise);
      }
      
      self.start = function() {
        if (!timerPromise) {
          _var.startTime = new Date();
          timerPromise = $interval(function() {
            var now = new Date();
            elapsedMs = now.getTime() - new Date(_var.startTime).getTime();
          }, 31);
          _var.timerPromise = JSON.stringify(timerPromise);
        }
      };
      
      self.stop = function() {
        if (timerPromise) {
          $interval.cancel(timerPromise);
          _var.timerPromise = timerPromise = "";
          totalElapsedMs = _var.totalElapsedMs = totalElapsedMs + elapsedMs;
          elapsedMs = 0;
        }
      };
      
      self.lap = function() {
        console.log(dateFilter(totalElapsedMs + elapsedMs, "mm:ss.sss").slice(0,8));
        $scope.lapAttr = dateFilter(totalElapsedMs + elapsedMs, "mm:ss.sss").slice(0,8);
      }
      
      self.reset = function() {
         _var.startTime = new Date();
        totalElapsedMs = elapsedMs = 0;
        _var.totalElapsedMs = "";
      };
      
      self.getElapsedMs = function() {
        //var timeToShow = totalElapsedMs + elapsedMs;
        //slice(-5);
        return dateFilter(totalElapsedMs + elapsedMs, "mm:ss.sss").slice(0,8);
      };
    }
  }
})
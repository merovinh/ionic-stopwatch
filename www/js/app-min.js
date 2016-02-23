angular.module("Stopwatch",["ionic"]).run(function($ionicPlatform){$ionicPlatform.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}).directive("stopWatch",function(dateFilter,$interval){return{restrict:"E",replace:!1,templateUrl:"StopWatch",scope:{},controllerAs:"swctrl",controller:function($scope,$interval){function updateStorage(){window.localStorage.laps=angular.toJson($scope.laps)}var self=this,_var=window.localStorage,totalElapsedMs=_var.totalElapsedMs?parseInt(_var.totalElapsedMs):0,elapsedMs=0;$scope.timerPromise=_var.timerPromise?JSON.parse(_var.timerPromise):"",$scope.laps=window.localStorage.laps?JSON.parse(window.localStorage.laps):[],$scope.$watch("laps",function(){updateStorage()},!0),$scope.timerPromise&&($scope.timerPromise=$interval(function(){var now=new Date;elapsedMs=now.getTime()-new Date(_var.startTime).getTime()},10),_var.timerPromise=JSON.stringify($scope.timerPromise)),self.start=function(){$scope.timerPromise||(_var.startTime=new Date,$scope.timerPromise=$interval(function(){var now=new Date;elapsedMs=now.getTime()-new Date(_var.startTime).getTime()},10),_var.timerPromise=JSON.stringify($scope.timerPromise))},self.stop=function(){$scope.timerPromise&&($interval.cancel($scope.timerPromise),_var.timerPromise=$scope.timerPromise="",totalElapsedMs=_var.totalElapsedMs=totalElapsedMs+elapsedMs,elapsedMs=0)},self.lap=function(){totalElapsedMs+elapsedMs!=0&&($scope.laps.push({time:dateFilter(totalElapsedMs+elapsedMs,"mm:ss.sss").slice(0,8),description:""}),updateStorage())},self.reset=function(){_var.startTime=new Date,totalElapsedMs=elapsedMs=0,_var.totalElapsedMs="",$scope.laps=[],updateStorage()},self.getElapsedMs=function(){return 500>(totalElapsedMs+elapsedMs)%1e3?dateFilter(totalElapsedMs+elapsedMs,"mm ss sss").slice(0,8):dateFilter(totalElapsedMs+elapsedMs,"mm:ss.sss").slice(0,8)},self.removeLap=function(id){$scope.laps.splice(id,1),updateStorage()}}}});
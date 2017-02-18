(function () {
	'use strict';
	var app = angular.module('iApp', ['chart.js', 'ui.bootstrap']);
	
	app.controller('ChartCtrl', ['$scope', '$interval', function ($scope, $interval) {
		var maximum = 100 || document.getElementById('container').clientWidth / 2 || 300;
		//$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
		$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];
		$scope.data = [[]];
		$scope.labels = [];
		$scope.options = {
			animation: {
				duration: 0
			},
			elements: {
				line: {
					borderWidth: 0.5
				},
				point: {
					radius: 2
				}
			},
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
					display: true
				}],
				yAxes: [{
					display: true
				}],
				gridLines: {
					display: true
				}
			},
			tooltips: {
				enabled: true
			}
		};
		
		// Update the dataset at 25FPS for a smoothly-animating chart
		//$interval(function () {
			//getLiveChartData();
		//}, 800);
		
		//$interval(function () {}, 0);
		
		//$scope.labels = [];
		function getLiveChartData () {
			if ($scope.data[0].length) {
				$scope.labels = $scope.labels.slice(1);
				$scope.data[0] = $scope.data[0].slice(1);
			}
			
			while ($scope.data[0].length < maximum) {
				$scope.labels.push('');
				$scope.data[0].push(getRandomValue($scope.data[0]));
			}
		}
		$scope.updateLiveChartData = function (data) {
			if ($scope.data[0].length) {
				$scope.labels = $scope.labels.slice(1);
				$scope.data[0] = $scope.data[0].slice(1);
			}
			
			while ($scope.data[0].length < maximum) {
				$scope.labels.push('');
				$scope.data[0].push(data);
			}
			$scope.$apply();
		}
		
		var socket = io('http://localhost:3000');
		// Add a connect listener
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
			socket.emit('subscribe', 'updates');

			// Add a connect listener
			socket.on('message',function(data) {
				console.log('Received a message from the server!',data);
				$scope.updateLiveChartData (data);
			});
			// Add a disconnect listener
			socket.on('disconnect',function() {
				console.log('The client has disconnected!');
			});
		});

	}]);
	
	function getRandomValue (data) {
		var l = data.length, previous = l ? data[l - 1] : 50;
		var y = previous + Math.random() * 10 - 5;
		return y < 0 ? 0 : y > 100 ? 100 : y;
	}
})();	
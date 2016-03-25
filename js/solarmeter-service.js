var https = require('https');
var fs = require('fs');
var baby = require('babyparse');

angular.module('SmartMirror').factory('solarMeterService', function ($http) {

	return {

		login: function(){
			console.log('logging in...');

			return $http({
				method: 'POST',
				url: config.solarservice.loginUrl,
				params: {
					email: config.solarservice.username,
					password: config.solarservice.password
				},
    			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    			withCredentials: true
			});
		},

		simpleCsvGet: function(cb) {
			$http({method: 'GET', url: config.solarservice.csvDownloadUrl})
				.success(function(data) { 
                    console.log('successfully got CSV data');
                    // pass in the contents of a csv file
					var parsed = baby.parse(data);

					// voila
					var rows = parsed.data;
					var totalGeneration = rows[1][10];
					var instantaneous = rows[1][11];
					var lastSampleT = rows[1][9];
					var cdSavingsKg = totalGeneration * config.solarservice.carbonFootPrintFactor;

					var solarStats = {		
						result: {
							lastSampleTime: lastSampleT,
							totalGen: totalGeneration,
							instantKw: instantaneous,
							cdSavingsKg: cdSavingsKg.toFixed(2)
						}
					};

					cb(solarStats);
                })
                .error(function (data, status, headers, config) {
                    $log.warn(data, status, headers(), config);
                });
		},

		getSummaryData: function(){
			$http({method: 'GET', url: config.solarservice.dataScrapeUrl})
				.success(function(data) { 
                    console.log('successfully got summary data', data);
                    // $scope.event = event; 
                })
                .error(function (data, status, headers, config) {
                    $log.warn(data, status, headers(), config);
                });
		}
	}
});
(function () {
    'use strict';

    angular
        .module(HygieiaConfig.module)
        .controller('deployViewController', deployViewController);

    deployViewController.$inject = ['$scope', 'DashStatus', 'deployData', 'DisplayState', '$q', '$uibModal'];
    function deployViewController($scope, DashStatus, deployData, DisplayState, $q, $uibModal) {
        /*jshint validthis:true */
        var ctrl = this;

        // public variables
        ctrl.environments = [];
        ctrl.statuses = DashStatus;
        ctrl.ignoreEnvironmentFailuresRegex=/^$/;
        if ($scope.widgetConfig.options.ignoreRegex !== undefined && $scope.widgetConfig.options.ignoreRegex !== null && $scope.widgetConfig.options.ignoreRegex !== '') {
            ctrl.ignoreEnvironmentFailuresRegex=new RegExp($scope.widgetConfig.options.ignoreRegex.replace(/^"(.*)"$/, '$1'));
        }

		ctrl.load = load ;
		//ctrl.load = captureDeploymentStatus('App_Deploy_FAT'); 
		//ctrl.load = captureDeploymentStatus('App_Deploy_NFR'); 
		//ctrl.load = captureDeploymentStatus('App_Deploy_Staging'); 
		//ctrl.load = captureDeploymentStatus('App_Deploy_PROD'); 
		
		
        
        ctrl.showDetail = showDetail;
		
		function load() {
			//alert("load");
                var success = function(json) {
					
				  var successCount = {"App_Deploy_FAT":"59", "App_Deploy_NFR":"61" , "App_Deploy_Staging":"81" , "App_Deploy_PROD" : "50"  };	
				  var failureCount = {"App_Deploy_FAT":"35", "App_Deploy_NFR":"38" , "App_Deploy_Staging":"18" , "App_Deploy_PROD" : "24"  };	
				 // alert("succeesss");
                  $("#downstream").empty(); 
                   
                  
				  
				  var allJobs = json["jobs"];
				  var nonSuccessfulJobs = allJobs.filter(function( job ) {
					//return job["lastBuild"] != null && job["lastBuild"]["result"] != "SUCCESS";
					return job["lastBuild"] != null;
				  });
		 
				
				  $.each(nonSuccessfulJobs, function( index, value ) {
				  
					 var jobName = value["displayName"];
					 var deployCheck = jobName.includes("Deploy");
					   if(deployCheck == true){
						   
						   
						    var countSuccess = successCount[jobName] ;
							var countFailure = failureCount[jobName] ;
							//alert(jobName + ":" + countSuccess + ":" + countFailure);
						    
							var trSuccess = (
								    '<tr style="font-size:1.2rem;font-weight:900;"'+ ' id='+jobName  +'>' +
								    '<td><span></span></td>' +
									'<td width="25%">'+ value["displayName"] +'</td>'+
									'<td width="25%" style="color: green;" align="center">'+ value["lastBuild"]["result"] +'</td>' +
									'<td width="25%" style="color: green;" align="center">' + countSuccess + '<span class="fa fa-arrow-up"></span></td>'+
									'<td width="25%" style="color: red;" align="center">' + countFailure + '<span class="fa fa-arrow-down"></span></td>' +
								     +'</tr>'
								);
								
								
							 var trFailure = (
								    '<tr style="font-size:1.2rem;font-weight:900;"'+ ' id='+jobName  +'>' +
								    '<td><span></span></td>' +
									'<td width="25%">'+ value["displayName"] +'</td>'+
									'<td width="25%"  style="color: red;" align="center">'+ value["lastBuild"]["result"] +'</td>' +
									'<td width="25%"  style="color: green;" align="center">' + countSuccess + '<span class="fa fa-arrow-up"></span></td>'+
									'<td width="25%"  style="color: red;" align="center">' + countFailure + '<span class="fa fa-arrow-down"></span></td>' +
								     +'</tr>'
								);	
								
							
							if(value["lastBuild"]["result"] == "SUCCESS"){
							   $("#downstream").append(trSuccess);
							}
							
							if(value["lastBuild"]["result"] == "FAILURE"){
							   $("#downstream").append(trFailure);
							}
							
						    
							//captureDeploymentStatus(jobName);
					   }
				  });
				       /*
				        captureDeploymentStatus('App_Deploy_FAT');
						captureDeploymentStatus('App_Deploy_NFR');
						captureDeploymentStatus('App_Deploy_Staging');
						captureDeploymentStatus('App_Deploy_PROD');
				       */
				};
		 
		 
		 
				$.ajax({
				  async: true,	
				  url: "http://172.18.51.88:8082" + "/api/json",
				  data: "depth=1&tree=jobs[displayName,lastBuild[result]]&jsonp=callBack",
				  jsonpCallback: "callBack",
				  dataType: 'jsonp',
		 
				  success: success
				});
				
				
				
				
				
				
				
			
        }
		
		function captureDeploymentStatus(jobName)
		{
			
			//alert("captureDeploymentStatus:::::::"+jobName);
			//**************************************************
				          //Making Another Ajax Call
						   var countFailure = 0;
	                       var countSuccess = 0;
						  
						  var success = function(json) {
						  //alert("hello success");
						
						  var allBuildJobs = json["builds"];
						  var nonSuccessfulJobs = allBuildJobs.filter(function( job ) {
							//return job["lastBuild"] != null && job["lastBuild"]["result"] != "SUCCESS";
							//alert(job["displayName"] +"=>"+job["result"]);
							countFailure = 0;
							countSuccess = 0;
							return job["result"] == "FAILURE";
						  });
						  
						  var successfulJobs = allBuildJobs.filter(function( job ) {
							//return job["lastBuild"] != null && job["lastBuild"]["result"] != "SUCCESS";
							//alert(job["displayName"] +"=>"+job["result"]);
							countFailure = 0;
							countSuccess = 0;
							return job["result"] == "SUCCESS";
						  });
						  
				 
						  //$("#downstream").html(nonSuccessfulJobs.length + " out of " + allJobs.length + " are currently failing");
						  $.each(nonSuccessfulJobs, function( index, value ) {
							 countFailure++;
							// alert("nonSuccessfulJobs:::"+countSuccess +":::"+ countFailure);
						  });
						  
						  $.each(successfulJobs, function( index, value ) {
							 countSuccess++;
							// alert("successfulJobs:::"+countSuccess +":::"+ countFailure);
						  });
						  
						  var trObj = document.getElementById(jobName).innerHTML;
						  trObj = trObj + '<td class="server-count">' + countSuccess + '<span class="fa fa-arrow-up"></span></td>'+
						                '<td class="server-count">' + countFailure + '<span class="fa fa-arrow-down"></span></td>';
										 
						  
						  
						 // document.getElementById(jobName).innerHTML = trObj; 
						 // alert(jobName+":::"+"Success::"+countSuccess +",  Failure:::"+countFailure);
						 // alert("tr:::"+document.getElementById(jobName).innerHTML);
						};
				 
						$.ajax({
						  async: true,		
						  url: "http://172.18.51.88:8082/job/" +jobName+ "/api/json",
						  data: "depth=1&tree=builds[displayName,result]&jsonp=callBack",
						  jsonpCallback: "callBack",
						  dataType: 'jsonp',
				 
						  success: success
						});
										   //Making Another Ajax Call
				
				//*************************************************
			
			//alert("End---->Success::"+countSuccess +",  Failure:::"+countFailure);
		}
		
		
		

        function load1() {
            var deferred = $q.defer();
            deployData.details($scope.widgetConfig.componentId).then(function(data) {
                processResponse(data.result);
                deferred.resolve(data.lastUpdated);
            });
            return deferred.promise;
        }

        function showDetail(environment) {
            $uibModal.open({
                controller: 'DeployDetailController',
                controllerAs: 'detail',
                templateUrl: 'components/widgets/deploy/detail.html',
                size: 'lg',
                resolve: {
					
					
                    environment: function() {
                        return environment;
                    },
                    collectorName: function () {
						//alert("env::"+env);
						//return env;
                        return $scope.dashboard.application.components[0].collectorItems.Deployment[0].collector.name;
                    },
                    collectorNiceName: function () {
                        return $scope.dashboard.application.components[0].collectorItems.Deployment[0].niceName;
                    }
                }
            });
        }

        function processResponse(data) {
            var worker = {
                getEnvironments: getEnvironments,
                getIsDefaultState: getIsDefaultState
            };
            
            var ignoreEnvironmentFailuresRegex = ctrl.ignoreEnvironmentFailuresRegex;
            
            function ignoreEnvironmentFailures(environment) {
            	return ignoreEnvironmentFailuresRegex.test(environment.name);
            }

            function getIsDefaultState(data, cb) {
                var isDefaultState = true;
                _(data).forEach(function (environment) {
                    var offlineUnits = _(environment.units).where({'deployed': false}).value().length;

                    if(environment.units && environment.units.length == offlineUnits
                    		&& !ignoreEnvironmentFailures(environment)) {
                        isDefaultState = false;
                    }
                });

                cb(isDefaultState);
            }

            function getEnvironments(data, cb) {
                var environments = _(data).map(function (item) {

                    return {
                        name: item.name,
                        url: item.url,
                        units: item.units,
                        serverUpCount: getServerOnlineCount(item.units, true),
                        serverDownCount: getServerOnlineCount(item.units, false),
                        failedComponents: getFailedComponentCount(item.units),
                        ignoreFailure: ignoreEnvironmentFailures(item),
                        lastUpdated: getLatestUpdate(item.units)
                    };

                    function getFailedComponentCount(units) {
                        return _(units).where({'deployed':false}).value().length;
                    }

                    function getServerOnlineCount(units, isOnline) {
                        var total = 0;
                        _(units).forEach(function (unit) {
                            total += _(unit.servers).where({'online':isOnline})
                                .value()
                                .length;
                        });

                        return total;
                    }

                    function getLatestUpdate(units) {
                        return _.max(units, function(unit) {
                            return unit.lastUpdated;
                        }).lastUpdated;
                    }
                }).value();

                cb({
                    environments: environments
                });
            }

            worker.getIsDefaultState(data, defaultStateCallback);
            worker.getEnvironments(data, environmentsCallback);
        }

        function defaultStateCallback(isDefaultState) {
            //$scope.$apply(function() {
                $scope.display = isDefaultState ? DisplayState.DEFAULT : DisplayState.ERROR;
            //});
        }

        function environmentsCallback(data) {
            //$scope.$apply(function () {
                ctrl.environments = data.environments;
            //});
        }
    }
})();

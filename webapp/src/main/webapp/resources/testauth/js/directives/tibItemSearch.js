/*jshint smarttabs: true */
testauth.directive("tibItemSearch",['$http','$parse', 'TibItemService','ItemService','ItemGroupService','FormPartitionService', function($http, $parse, TibItemService, ItemService, ItemGroupService, FormPartitionService){
	return {
		restrict:"A",
		scope:{
			locationType : '=',
            tenantId:'=',
            segmentId:'=',
			formPartitionId:'=',
			groupId:'=',
			segmentMap:'=',
			formPartitionMap:'=',
			closeSearch:'&',
			openSearch:'&',
			defaultParams:'='
		},
		transclude :true,
		replace:true,
		templateUrl: 'resources/testauth/partials/tib-item-search.html',
		controller: function($scope, $attrs) {
			$scope.searchingTib = false;
			$scope.itemsAdded = 0;
			$scope.itemsImported = false;
			$scope.searchResultsFound=false;
			$scope.params = [{}];
			$scope.importResponse = {};
			$scope.importScreenVisible = false;
			$scope.previewVisible = false;
			$scope.importingItems = false;
			$scope.showTibSearch = true;
		
			var AUTO_ASSIGN = "AUTO_ASSIGN";
			$scope.importToSegment = function(){
				return $scope.locationType == "SEGMENT";
			};
			$scope.importToPartition = function(){
				return $scope.locationType == "FORM_PARTITION";
			};
			
			$scope.showImport = function() {
				$scope.refreshItemGroups($scope.segmentId);
				$scope.importScreenVisible = true;
				$scope.previewVisible = false;
			};
			
			$scope.showSearch = function() {
				$scope.importScreenVisible = false;
				$scope.previewVisible = false;
			};
			
			$scope.showPreview = function(){
				$scope.importScreenVisible = false;
				$scope.previewVisible = true;
			};
			
			$scope.addParam = function(){
				$scope.params.push({});
			};
			
			$scope.removeParam = function(index){
				$scope.params.splice(index, 1);
			};
			
			$scope.clearParams = function(){
				$scope.params.splice(0,$scope.params.length);
			};
			
			$scope.sortParams = function(filter){
				return filter.filterName;
			};
			
			$scope.itemSearchParams = {pageSize:"6", "currentPage": 1};
			$scope.itemSearchResponse = {};
			
			$scope.viewResults = false;
			
			$scope.getLocationId = function(){
				var location = "";
				if($scope.locationType == "SEGMENT"){
					location = $scope.segmentId;
				}
				if($scope.locationType == "FORM_PARTITION"){
					location = $scope.formPartitionId;
				}
				return location;
			};
			
			$scope.refreshItemGroups = function(){
				$scope.itemGroupMap = {};
				var locationId = $scope.getLocationId();
				if(locationId){
					ItemGroupService.search({"locationType" : $scope.locationType,"locationId": locationId, "pageSize": 1000, "sortKey":"groupName"}).then( function(response){
							 if(response.data){
								$scope.itemGroupMap[AUTO_ASSIGN] = {id:AUTO_ASSIGN, groupName: 'Auto assign group'};
								if(response.data.searchResults){
									angular.forEach(response.data.searchResults, function(itemGroup){
										$scope.itemGroupMap[itemGroup.id] = itemGroup;
									});
								}
								$scope.itemGroupId = AUTO_ASSIGN;
							 }
						 });
				}
			};
			
			$scope.getFilterSummary = function(params){
				$scope.paramErrors = null;
				var prettyString = "";
				var paramsArrayMap = {};
				angular.forEach(params, function(param,index){
					if(param.filterValue && param.filterValue.trim().length >0){
						if(paramsArrayMap[param.filterName]  == null){
							paramsArrayMap[param.filterName] = [];
						}
						if(paramsArrayMap[param.filterName].indexOf(param.filterValue) != -1) {
							//duplicate parameter found
							$scope.paramErrors = "Please remove duplicate search params before searching.";
						} else {
							paramsArrayMap[param.filterName].push(param.filterValue);
						}
					}
				});
				angular.forEach(paramsArrayMap, function(values, paramName){
					if(paramName != null && paramName != "null" && paramName != "undefined") {
						if(prettyString.length > 0) prettyString += " and ";
						if(values.length > 1){
							prettyString += " " + paramName + " is one of (" +values +")";	
						}else{
							prettyString += " " + paramName + " is '" + values +"'";
						}
					}
				});
				return  prettyString;
			};
			
			$scope.filtersUpdated = function(filter){
				$scope.itemSearchResponse={};
				filter.filterValue = null;
			};
			
			$scope.searchTibItems = function(searchParams){
				angular.forEach($scope.params, function(param,index){
					if(param.filterValue && param.filterValue.length >0){
					    if (searchParams[param.filterName] == null) {
					        searchParams[param.filterName] = [];
					    }
						searchParams[param.filterName].push(param.filterValue);
					}
				});
                $scope.searchingTib = true;
                $scope.$apply();
				$scope.itemsImported = false;
				$scope.searchResultsFound = false;
				searchParams.tenantId = $scope.tenantId;
		  		return TibItemService.searchItems(searchParams).then(function(results){
		  			$scope.searchingTib = false;
		  			$scope.searchResultsFound = true;
					return results;
		  		});
			};
			
			$scope.importItems = function(){			    
				var importParams = {};
				angular.forEach($scope.params, function(param,index){
					if(param.filterValue && param.filterValue.length >0){
					//	importParams[param.filterName] = param.filterValue;
				    if (importParams[param.filterName] == null) {
				        importParams[param.filterName] = [];
				    }
					importParams[param.filterName].push(param.filterValue);					
					}
				});
				$scope.searchingTib = true;
				$scope.importingItems = true;
				importParams.pageSize = 1000000;

				importParams.tenantId = $scope.tenantId;
				importParams.targetItemGroupId = $scope.itemGroupId == AUTO_ASSIGN ? "" : $scope.itemGroupId;
				importParams.targetSegmentId =  $scope.segmentId == null ? "" : $scope.segmentId;
				importParams.targetFormPartitionId = $scope.formPartitionId == null ? "" : $scope.formPartitionId; 
				
				
				ItemService.importItemsFromTib(importParams).then(function(response){
					if(response.errors){
						$scope.importerrors = response.errors;
					}
					if(response.data){
						$scope.importResponse = response.data;
					};
					$scope.$broadcast('initiate-itempool-search');
					$scope.itemsImported = true;
					$scope.searchingTib = false;
					$scope.searchResultsFound = false;
					$scope.importingItems = false;
				});
			};
			
			$scope.cancel = function(){
				$scope.closeSearch();
				$scope.showSearch();
			};
			
			$scope.$watchCollection("defaultParams", function(values){
				$scope.params.splice(0, $scope.params.length);
				angular.forEach($scope.defaultParams, function(paramObject){
					angular.forEach(paramObject, function(value,filter){
						var obj = {'filterName': filter, 'filterValue':value };
						$scope.params.push(obj);	
					});
				});
				$scope.searchResultsFound=false;
			},true);
		},
		link:function(scope, element, attrs){
		    TibItemService.getItemMetadata(scope.tenantId).then(function(response) {
		        if (response.data.metadataKeys) {
                    scope.filterOptions = $.map( response.data.metadataKeys.sort(), function(metadata) { 
                        return { "key":metadata, "title":metadata }; 
                     });
		        } else {
		            scope.metadataErrors = "TIB contains no item metadata for this tenant.";
		        }
            });
		}
	};
}]);

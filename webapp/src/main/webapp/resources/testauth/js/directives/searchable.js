/*jshint smarttabs: true */
testauth.directive("searchable",['$http','$parse', function($http, $parse){
	return {
		restrict:"A",
		scope:{
			searchPromise:'&',
			searchParams:'=',
			searchResponse:'=',
			searchParamsPreprocess : '&',
			searchPostProcess: '&',
			deactivateInitialSearch:'@',
			broadcastSignal:'@'
		},
		transclude :true,
		templateUrl: 'resources/testauth/partials/searchable.html',
		controller: function($scope, $attrs) {
			this.search = function(searchParams){
			    $scope.searchParamsPreprocess();
				$scope.searchResponse.searching = true;
				//make sure we have a valid number
				var pageNum = (searchParams.currentPage+'').replace(/\D/g, '') *1;
				searchParams.currentPage = pageNum > 0 ? pageNum:1;
				var params = JSON.parse(JSON.stringify(searchParams));
				params.currentPage = params.currentPage -1;
				$scope.searchPromise({params:params}).then(function(response) {
					if(response.errors && response.errors.length > 0){
						$scope.errors = response.errors;
					}else{
						$scope.errors = [];
						$scope.searchResponse = response.data;
						$scope.searchResponse.currentPage = ($scope.searchResponse.currentPage *1) +1;
						$scope.searchResponse.lastPage = parseInt((($scope.searchResponse.totalCount*1) / ($scope.searchResponse.pageSize*1))) + 1;
						if ($scope.searchPostProcess) {
							if($scope.searchResponse.searchResults) {
	    						$.each($scope.searchResponse.searchResults, function(index,result) {
	    						    $scope.searchPostProcess({response:result});
	    			            });
							} else {
	    						$.each($scope.searchResponse.payload, function(index,result) {
	    						    $scope.searchPostProcess({response:result});
	    			            });
							}
						}
					}
					$scope.searchResponse.searching = false;
					
				});	
			};
			
			this.changePage = function(){
				this.search($scope.searchParams);
			};
			
			this.filterChange = function(){
				$scope.searchParams.currentPage = 1;
				this.search($scope.searchParams);
			};
			
			this.setFilter = function(params){
				$scope.searchParams = params;
				$scope.searchParams.currentPage = 1;
			};
			
			this.addFilter = function(param, value){
				$scope.searchParams[param] = value;
				$scope.searchParams.currentPage = 1;
				this.search($scope.searchParams);
			};
			
			this.sortChange = function(sortKey, element){
				element.parent().children().removeClass("headerSortDown headerSortUp");
		        if ($scope.searchParams.sortKey == sortKey && $scope.searchParams.sortDir == "asc") {
		        	 $scope.searchParams.sortDir = "desc";
		        	 element.addClass('headerSortDown');
		        } else if ($scope.searchParams.sortKey == sortKey && $scope.searchParams.sortDir == "desc") {
		        	 $scope.searchParams.sortDir = "asc";
		        	 element.addClass('headerSortUp');
		        } else {
		        	 $scope.searchParams.sortKey = sortKey;
		        	 $scope.searchParams.sortDir = "asc";
		        	 element.addClass('headerSortUp');
		        }
				this.search($scope.searchParams);
			};
			
			$scope.search = this.search;
			if ($scope.broadcastSignal) {
			    $scope.$on($scope.broadcastSignal, function() {
	                $scope.search($scope.searchParams);
	            }); 
			}

            if ($scope.deactivateInitialSearch != "true") {
                this.search($scope.searchParams);
            }
		},
		link:function(scope, element, attrs){
			
		}
	};
}]);


testauth.directive("searchOnClick", function(){
	return {
		restrict:"A",
		require:"^searchable",
		scope:{
			setParams:'&'
		},
		transclude:false,
		link : function(scope, element, attrs, searchableController) {
			element.bind("click", function(){
				if(angular.isDefined(scope.setParams) && scope.setParams()){
					searchableController.setFilter(scope.setParams());
				}
				searchableController.filterChange();
			});
		}
	};
});

testauth.directive("searchOnChange", function(){
	return {
		restrict:"A",
		require:"^searchable",
		scope:{
			setParams:'&'
		},
		transclude:false,
		link : function(scope, element, attrs, searchableController) {
			element.bind("change", function(){
				if(angular.isDefined(scope.setParams) && scope.setParams()){
					searchableController.setFilter(scope.setParams());
				}
				searchableController.filterChange();
			});
		}
	};
});

testauth.directive("addFilter", function(){
	return {
		restrict:"A",
		require:"^searchable",
		scope:{
			filterParam:'@',
			filterValue:'='
		},
		transclude:false,
		link : function(scope, element, attrs, searchableController) {
			element.bind("click", function(){
				searchableController.addFilter(scope.filterParam, scope.filterValue);
			});
		}
	};
});

testauth.directive("sortOnClick", function(){
	return {
		restrict:"A",
		require:"^searchable",
		transclude:false,
		link:function(scope, element, attrs, searchableController){
			element.bind('mouseenter', function(){
	            element.addClass('columnHover');
	            element.addClass('headerSortHover');
	        })
	        .bind('mouseleave', function(){
	        	element.removeClass('columnHover');
	        	element.removeClass('headerSortHover');
	        })
			.bind("click", function(){
				searchableController.sortChange(attrs.sortColumn, element);
			});	
		}
	};
});

testauth.directive("pageable", function(){
    return {
        restrict:"A",
        transclude :true,
        require:"^searchable",
        scope:{
            pagingInfo:'=',
            searchParams:'=',
            changePage:'&',
            disabledSearch:'@',
            topPageBar:'@'
        },
        templateUrl: 'resources/testauth/partials/pageable-table.html',
        controller: function($scope, $attrs) {
            $scope.nextPage = function(){
                $scope.searchParams.currentPage = $scope.searchParams.currentPage + 1;
                $scope.changePage();
            };
            $scope.prevPage = function(){
                $scope.searchParams.currentPage = $scope.searchParams.currentPage - 1;
                $scope.changePage();
            };
            $scope.lastPage = function(){
                $scope.searchParams.currentPage = $scope.pagingInfo.lastPage;
                $scope.changePage();
            };
            $scope.firstPage = function(){
                $scope.searchParams.currentPage = 0;
                $scope.changePage();
            };
            $scope.totalPages = function(totalRecords, pageSize) {
            	return Math.ceil(totalRecords / pageSize);
            };
        },
        link:function(scope, element, attrs, searchableCtrl){
            scope.changePage = function() {
                searchableCtrl.changePage();
            };
        }
    };
});


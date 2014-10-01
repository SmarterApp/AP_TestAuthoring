testauth.controller('AssessmentSummaryController',['$scope','$state', '$filter', 'loadedData', 'segmentListData', 'AssessmentService', 'BlueprintElementService', 'ItemService', 'ItemGroupService', 'FormService', 'ScoringRuleService', 'PerformanceLevelService', 'ReportingMeasureService',  
    function($scope, $state, $filter, loadedData, segmentListData, AssessmentService, BlueprintElementService, ItemService, ItemGroupService, FormService, ScoringRuleService, PerformanceLevelService, ReportingMeasureService) {
		$scope.errors = loadedData.errors;
		$scope.assessment = loadedData.data;
		$scope.assessmentSummaryData = {};

        $scope.getBlueprintSearchParams = function() {
        	return {"assessmentId": $scope.assessment.id, "active":"true",  "currentPage": 1, "pageSize":"0"};
        };
        
  		$scope.getItemSearchParams = function() {
  			var params = {"assessmentId": $scope.assessment.id
  						, "sortKey":"itemGroupId"
		        		, "sortDir":"desc", "currentPage": 1
		        		, "pageSize":"20"};
  						var filteredSegments = $filter('adaptiveSegments')(segmentListData.data.searchResults);
  						if(filteredSegments != null && filteredSegments.length > 0){
			  				params.segmentId = filteredSegments[0].id;
			  			} else {
			  				params.segmentId = "segment-not-found";
			  			}
  			return params;
  		};
  		
  		$scope.getItemGroupSearchParams = function() {
  			return { "assessmentId" : $scope.assessment.id, "sortKey" : "name", "sortDir" : "asc", "currentPage" : 1};
  		};
  		
        $scope.getFormSearchParams = function() {
            return {"assessmentId": $scope.assessment.id, "sortKey":"order", "sortDir":"asc", "pageSize" : 50, "currentPage": 0};
        };
        
        $scope.getScoringRuleSearchParams = function() {
            return {"assessmentId": $scope.assessment.id, "sortKey":"blueprintReferenceType, blueprintReferenceName", "sortDir":"asc", "currentPage": 0};
        };
        
        $scope.getPerformanceLevelSearchParams = function() {
            return {"assessmentId": $scope.assessment.id, "sortKey":"blueprintReferenceType, blueprintReferenceName", "sortDir":"asc", "currentPage": 0};
        };
        
        $scope.getReportingMeasureSearchParams = function() {
            return {"assessmentId": $scope.assessment.id, "currentPage": 0, "pageSize":"50"};
        };
        

        $scope.addSummaryData = function(data, expandData, label, cssClass, index) {
			var summaryData = {};
			summaryData["label"] = label;
			summaryData["class"] = cssClass;
			summaryData["data"] = data;
			summaryData["expandData"] = expandData;
			$scope.assessmentSummaryData[index] = summaryData;
        };
        
        // Assessment
		var assessmentData = [];
		var assessmentExpandData = [];
		assessmentData.push("Label: " + $scope.assessment.label);
		assessmentExpandData.push("Subject: " + $scope.assessment.subject.name);
		assessmentExpandData.push("Publication: " + $scope.assessment.publication.coreStandardsPublicationKey);
		assessmentExpandData.push("Grade(s): " + $scope.assessment.grade);
		assessmentExpandData.push("Type: " + $scope.assessment.type);
        $scope.addSummaryData(assessmentData, assessmentExpandData, "Assessment", "greenRow", 1);
        
        // Segment
		var data = [];
		var expandData = [];
		var segmentCount = 0;
		var fixedFormLength = 0;
		var adaptiveSegmentLength = 0;
		
		if(segmentListData.data != null && segmentListData.data.searchResults != null  && segmentListData.data.totalCount > 0){
			segmentCount = segmentListData.data.totalCount;
			
			$scope.fixedFormSegmentList = $filter('fixedFormSegments')(segmentListData.data.searchResults);
			$scope.adaptiveSegmentList = $filter('adaptiveSegments')(segmentListData.data.searchResults);
			fixedFormLength = $scope.fixedFormSegmentList.length;
			adaptiveSegmentLength = $scope.adaptiveSegmentList.length;
		};
		data.push("Count: " + segmentCount);
		expandData.push("Fixed Form Segments: " + fixedFormLength);
		expandData.push("Adaptive Segments: " + adaptiveSegmentLength);
		$scope.addSummaryData(data, expandData, "Segments", "blueRow", 2);
  		
		// Blueprint
        BlueprintElementService.search($scope.getBlueprintSearchParams()).then(function(response) {
			var data = [];
			var expandData = [];
			data.push("Total Standards: " + response.data.totalCount);
			
	        BlueprintElementService.getElementTotalCounts($scope.assessment.id).then(function(response) {
	        	expandData.push("OP Min: " + response.data.opMin);
	        	expandData.push("OP Max: " + response.data.opMax);
	        	expandData.push("FT Min: " + response.data.ftMin);
	        	expandData.push("FT Max: " + response.data.ftMax);
	        });
	        
			$scope.addSummaryData(data, expandData, "Blueprints", "redRow", 3);
        });
        
        // Item
        ItemService.search($scope.getItemSearchParams()).then(function(response) {
			var data = [];
			var expandData = [];
			data.push("Count: " + response.data.totalCount);
			
			ItemGroupService.search($scope.getItemGroupSearchParams()).then(function(response) {
				expandData.push("Item Group Count: " + response.data.totalCount);
			});
			$scope.addSummaryData(data, expandData, "Items", "blueRow", 4);
        });

         // Form
        FormService.search($scope.getFormSearchParams()).then(function(response) {
			var data = [];
			var expandData = [];
			data.push("Count: " + response.data.totalCount);
			expandData.push("# of Partitions: " + $filter('formPartitionCount')(response.data.searchResults));
			expandData.push("English: " + $filter('englishForm')(response.data.searchResults).length);
			expandData.push("Non English: " + $filter('nonEnglishForm')(response.data.searchResults).length);
			$scope.addSummaryData(data, expandData, "Forms", "redRow", 5);
        });
        
        // Scoring Rule
        ScoringRuleService.search($scope.getScoringRuleSearchParams()).then(function(response) {
			var data = [];
			var expandData = [];
			
			data.push("Count: " + response.data.totalCount);
			expandData.push("Assessment: " + $filter('assessmentBpReference')(response.data.searchResults).length);
			expandData.push("Segment: " + $filter('segmentBpReference')(response.data.searchResults).length);
			expandData.push("Affinity Group: " + $filter('affinityBpReference')(response.data.searchResults).length);
			expandData.push("Blueprint Standard: " + $filter('standardBpReference')(response.data.searchResults).length);
			$scope.addSummaryData(data, expandData, "Scoring Rules", "greenRow", 6);
        });
        
        // Performance Level
        PerformanceLevelService.search($scope.getPerformanceLevelSearchParams()).then(function(response) {
			var data = [];
			var expandData = [];
			
			data.push("Count: " + response.data.totalCount);
			expandData.push("Assessment: " + $filter('assessmentBpReference')(response.data.searchResults).length);
			expandData.push("Segment: " + $filter('segmentBpReference')(response.data.searchResults).length);
			expandData.push("Affinity Group: " + $filter('affinityBpReference')(response.data.searchResults).length);
			expandData.push("Blueprint Standard: " + $filter('standardBpReference')(response.data.searchResults).length);
			$scope.addSummaryData(data, expandData, "Performance Levels", "redRow", 7);
        });
        
        // Reporting Measure
        ReportingMeasureService.search($scope.getReportingMeasureSearchParams()).then(function(response) {
			var data = [];
			var expandData = [];
			
			data.push("Count: " + response.data.totalCount);
			expandData.push("Assessment: " + $filter('assessmentBpReference')(response.data.searchResults).length);
			expandData.push("Segment: " + $filter('segmentBpReference')(response.data.searchResults).length);
			expandData.push("Affinity Group: " + $filter('affinityBpReference')(response.data.searchResults).length);
			expandData.push("Blueprint Standard: " + $filter('standardBpReference')(response.data.searchResults).length);
			$scope.addSummaryData(data, expandData, "Reporting Measures", "greenRow", 8);
        });

	}]);

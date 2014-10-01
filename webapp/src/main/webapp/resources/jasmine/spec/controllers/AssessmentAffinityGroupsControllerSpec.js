describe('AssessmentAffinityGroupsController ', function() {
    
    var scope = null;
    var state = null;
    var windowMock = null;
    var affinityGroupService = null;
    
    var affinityGroup = {
            "id":"affinityGroupId",
            "groupName":"My Affinity Group",
            "active": true,
            "affinityGroupValueMap": {
                "MASTER" : {
                    operationalItemMinValue: "0",
                    operationalItemMaxValue: "0",
                    fieldTestItemMinValue: "0",
                    fieldTestItemMaxValue: "0"
                }
            }
    };
    

	// you need to indicate your module in a test
	beforeEach(module('testauth', function($provide) {
		return $provide.decorator('$state', function() {
			return {
				transitionTo : function(path) {
					return {};
				},
			};
		});
	}));

	beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, AffinityGroupService) {
	    scope = $rootScope.$new();
	    state = $state;
	    state.current = {};
	    windowMock = $window;
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        
        scope.searchResponse = {"searchResults" : affinityGroup };
        
	    affinityGroupService = AffinityGroupService;
	    
	    var mockForm = { isPristine: true};
	    mockForm.$setPristine = function() { this.isPristine = true; };
	    mockForm.$show = function() {};
	    mockForm.$cancel = function() {};
	    scope.editableForm = mockForm;
	    mockForm.$setError = function(fieldname, msg) {
	        angular.forEach(this.$editables, function(editable) {
	            if (!name || editable.name === name) {
	                editable.setError(msg);
	            }
	        });
	    };
	    $controller("AssessmentAffinityGroupsController", {
	       $scope : scope,
	       affinityGroupService: AffinityGroupService,
	       loadedData: {data:{}, errors:[]},
	       loadedSegments: {data:{}, errors:[]}
	    });
	}));

	it("searches for affinity groups based on parameters", function() {
	    spyOn(affinityGroupService, "searchAffinityGroups");
	    scope.searchAffinityGroups({});
	    expect(affinityGroupService.searchAffinityGroups).toHaveBeenCalledWith({});
	    scope.searchAffinityGroups({"groupName":"AG"});
	    expect(affinityGroupService.searchAffinityGroups).toHaveBeenCalledWith({"groupName":"AG"});
	});
	
	it('transitions to new AG page when addNewAffinityGroup() called', function() {
	    spyOn(state, "transitionTo");
	    scope.assessment = { id: "myAssessmentId" };
	    scope.addNewAffinityGroup();
	    expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.affinityGroupForm', {"assessmentId":"myAssessmentId"});
	});
	
    it('transitions to edit AG page when editAffinityGroup() called', function() {
        spyOn(state, "transitionTo");
        scope.assessment = { id: "myAssessmentId" };
        scope.editAffinityGroup("myAffinityGroupId");
        expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.affinityGroupForm', {"assessmentId":"myAssessmentId", "affinityGroupId":"myAffinityGroupId"});
    });
    
    it("deletes affinity groups properly", function() {
        spyOn(windowMock, "confirm").andReturn(true);
        spyOn(affinityGroupService, "remove").andCallThrough();
        spyOn(scope, "$broadcast").andCallThrough();
        
        httpMock.expectDELETE(/affinityGroup/).respond("");
        
        scope.removeAffinityGroup(affinityGroup);
        httpMock.flush();
        
        expect(affinityGroupService.remove).toHaveBeenCalledWith(affinityGroup);
        expect(scope.errors).toEqual([]);
        expect(scope.$broadcast).toHaveBeenCalledWith('initiate-affinityGroup-search');
    });
    
    it("makes copies on edit", function() {
        scope.searchResponse = {"searchResults" : affinityGroup};
        scope.edit(scope.editableForm);
        expect(scope.originalAffinityGroups).not.toBeNull();
        expect(scope.originalErrors.length).toEqual(0);
    });
    
    it("saves properly", function() {
        spyOn(affinityGroupService, "updateCollection").andCallThrough();
        spyOn(scope, "$broadcast").andCallThrough();
        httpMock.expectPUT(/affinityGroup/).respond(affinityGroup);
        var affinityGroupList = [];
        affinityGroupList.push(affinityGroup);
        scope.saveAll(affinityGroupList, scope.editableForm);
        httpMock.flush();
        
        expect(affinityGroupService.updateCollection).toHaveBeenCalled();
        expect(scope.savingIndicator).toEqual(false);
        expect(scope.isNew).toEqual(false);
        expect(scope.$broadcast).toHaveBeenCalledWith('initiate-affinityGroup-search');
        expect(scope.saveIndicator).toEqual(false);
        expect(scope.disabledSearch).toEqual(false);
    });
    
    it("reverts to original values when cancel is called", function() {
        spyOn(scope.editableForm, "$setPristine").andCallThrough();
        spyOn(scope.editableForm, "$cancel").andCallThrough();
        scope.originalAffinityGroups = [{"id":"1", "groupName":"one", "active":true}, {"id":"2", "groupName":"two", "active":true}];
        scope.searchResponse = {"searchResults":[{"id":"1", "groupName":"oneABC", "active":true}, {"id":"2", "groupName":"twoXYZ", "active":true}]};
        
        
        scope.cancel(scope.editableForm);
        
        expect(scope.editableForm.$setPristine).toHaveBeenCalled();
        expect(scope.editableForm.$cancel).toHaveBeenCalled();
        expect(scope.searchResponse.searchResults).toEqual(scope.originalAffinityGroups);
        expect(scope.errors.length).toEqual(0);
        expect(scope.disabledSearch).toEqual(false);
        
    });
    
    it("should set the disabledSearch variable to true", function() {
        scope.disableSearch();
        expect(scope.disabledSearch).toEqual(true);
    });
    
    it("should return a validation error if necessary", function() {
        scope.errorsMap = {"affinityGroups[0].affinityGroupValueMap[myid].fieldTestItemMaxValue": "Error message!"};
        
        expect(scope.hasValidationError(0, "myid", "fieldTestItemMaxValue")).toBeTruthy();
        expect(scope.hasValidationError(0, "myid", "fieldTestItemMinValue")).toBeFalsy();
        expect(scope.hasValidationError(0, "XYZ", "fieldTestItemMaxValue")).toBeFalsy();
    });
    
    it("should return a selection parameter validation error if necessary", function() {
        scope.errorsMap = {"affinityGroups[0].affinityGroupValueMap[myid].itemSelectionParameters[FP2]": "Error message!"};
        expect(scope.hasSelectionParamValidationError(0, "myid", "FP2")).toBeTruthy();
        expect(scope.hasSelectionParamValidationError(0, "XYZ", "FP2")).toBeFalsy();
        expect(scope.hasSelectionParamValidationError(0, "XYZ", "ABCXYZ")).toBeFalsy();
    });

});

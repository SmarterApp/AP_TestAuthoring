describe('AssessmentAffinityGroupFormController ', function() {
    
    var scope = null;
    var state = null;
    var windowMock = null;
    var affinityGroupService = null;
    var coreStandardsService = null;
    
    var affinityGroup = {
            "id":"affinityGroupId",
            "groupName":"My Affinity Group",
            "active": true
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
    
    beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, AffinityGroupService, CoreStandardsService) {
        scope = $rootScope.$new();
        state = $state;
        state.current = {};
        windowMock = $window;
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        
        scope.searchResponse = {"searchResults" : affinityGroup };
        
        affinityGroupService = AffinityGroupService;
        coreStandardsService = CoreStandardsService;
        spyOn(coreStandardsService, "searchSocksByPublication").andCallThrough();
        
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
        $controller("AssessmentAffinityGroupFormController", {
           $scope : scope,
           affinityGroupService: AffinityGroupService,
           coreStandardsService: CoreStandardsService,
           loadedData: {data:{publication: { coreStandardsPublicationKey: "ABC" }}, errors:[]},
           loadedAffinityGroup: {data: {}},
           loadedSegments: {data:{}, errors:[]}
        });
    }));
    
    it('transitions to AG list when back() is called', function() {
        spyOn(state, "transitionTo");
        scope.assessment = { id: "myAssessmentId" };
        scope.back();
        expect(state.transitionTo).toHaveBeenCalledWith('assessmenthome.affinityGroups', {"assessmentId":"myAssessmentId"});
    });
    
    it("saves properly ad hoc", function() {
        scope.affinityGroupType = "adhoc";
        spyOn(affinityGroupService, "save").andCallThrough();
        httpMock.expectGET(/coreStandard/).respond([]);
        httpMock.expectPOST(/affinityGroup/).respond(affinityGroup);
        scope.save();
        httpMock.flush();
        expect(affinityGroupService.save).toHaveBeenCalled();
        expect(scope.savingIndicator).toEqual(false);
        expect(scope.affinityGroup.sock).toBeUndefined();
        expect(scope.isNew).toEqual(false);
    });
    it("saves properly sock", function() {
        scope.affinityGroupType = "sock";
        scope.affinityGroup.sock = "My SOCK 1";
        spyOn(affinityGroupService, "save").andCallThrough();
        httpMock.expectGET(/coreStandard/).respond([]);
        httpMock.expectPOST(/affinityGroup/).respond(affinityGroup);
        scope.save();
        httpMock.flush();
        expect(affinityGroupService.save).toHaveBeenCalled();
        expect(scope.savingIndicator).toEqual(false);
        expect(scope.affinityGroup.sock).toEqual(scope.affinityGroup.groupName);
        expect(scope.isNew).toEqual(false);
    });
    
    it('allows editing when edit() is called', function() {
        scope.edit();
        expect(scope.originalAffinityGroup).not.toBeNull();
        expect(scope.originalAffinityGroupType).not.toBeNull();
    });

    it("reverts to original values when cancel is called", function() {
        spyOn(scope.editableForm, "$setPristine").andCallThrough();
        spyOn(scope.editableForm, "$cancel").andCallThrough();
        scope.originalAffinityGroup = {"id":"1", "groupName":"one", "active":true};
        scope.originalAffinityGroupType = "adhoc";
        
        scope.cancel(scope.editableForm);
        
        expect(scope.editableForm.$setPristine).toHaveBeenCalled();
        expect(scope.editableForm.$cancel).toHaveBeenCalled();
        expect(scope.affinityGroup).toEqual(scope.originalAffinityGroup);
        expect(scope.affinityGroupType).toBe(scope.originalAffinityGroupType);
        
    });
});
describe('AssessmentPublishingController ', function() {
  var scope = null;
  var state = null;
  var publishingRecordService = null;
  var userService = null;
  var windowMock = null;
  var q = null;
  
  var savedApproval = {
          "id" : "approvalId_12345",
          "publishingRecordId" : "publishingRecordId_12345",
          "status" : "Pending",
          "permission" : "Content Lead",
          "username" : "Content Lead",
          "level" : "1",
          "version" : "1.0",
        };

  var savedAssessment = {
          "id" : "assessmentId_12345",
          "name" : "Mathematics Test",
        };
  
  var savedPublishingRecord = {
          "id" : "publishingRecordId_12345",
          "version" : "1.0",
          "purpose" : [ "REGISTRATION"],
          "status" : "INPROGRESS"
        };

  var savedPublishingRecord2 = {
          "id" : "id_67890",
          "version" : "1.1",
          "purpose" : [ "REGISTRATION"],
          "status" : "AWAITING_APPROVAL"
        };
  
  var currentUser = {"username":"Content Lead", "fullName":"Test Content Lead"};
  
  var authorities = [{"authority":"Test Author"}, {"authority":"Content Lead"}];

  //you need to indicate your module in a test  
  beforeEach(module('testauth', function($provide) {
      return $provide.decorator('$state', function () {
          return {
              transitionTo: function (path) {
                  return {};
              },
          };
      });
  }));
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q, PublishingRecordService, AssessmentService, UserService, ApprovalService) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        
        // initiate required variables
        state = $state;
        state.current = {};
        scope.tabs = [{ label:"Publishing", select:"assessmenthome.publishing", active:false }];
        scope.tabIndexes = {PUBLISHING:0};

        publishingRecordService = PublishingRecordService;
        assessmentService = AssessmentService;
        userService = UserService;
        approvalService = ApprovalService;
        windowMock = $window;
        q = $q;

        // create controller
        $controller('AssessmentPublishingController', {
            $scope : scope,
            $window : windowMock,
            loadedData : { errors: [], data: savedAssessment },
            loadedPublishingValidity : { errors: [], data: savedPublishingRecord },
            publishingRecordService: PublishingRecordService,
            assessmentService: AssessmentService,
            userService: UserService,
            approvalService: ApprovalService
      });
        
  }));
  
  it('publishes assessment by calling service', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(publishingRecordService, "update").andCallThrough();

      expect(scope.updateIndicator).toEqual(false);
      httpMock.expectGET(/user\/currentUser/).respond(currentUser);
      httpMock.expectGET(/approval\/current/).respond(savedApproval);
      httpMock.expectPUT(/publishingRecord/).respond(savedPublishingRecord);
      httpMock.expectGET(/approval\/isAdminUser/).respond(true);
      httpMock.expectGET(/approval\/current/).respond(savedApproval);
      
      scope.save("Approve");
      expect(scope.updateIndicator).toEqual(true);
      httpMock.flush();

      expect(publishingRecordService.update).toHaveBeenCalledWith(savedPublishingRecord, false);
      expect(scope.errors.length).toBe(0);
      expect(scope.updateIndicator).toEqual(false);
  });
  
  it('handles publish errors correctly', function() {
      spyOn(windowMock,"confirm").andReturn(true);    
      spyOn(publishingRecordService, "update").andCallThrough();

      expect(scope.updateIndicator).toEqual(false);
      scope.publishingRecord = savedPublishingRecord2;
      
      httpMock.expectGET(/user\/currentUser/).respond(currentUser);
      httpMock.expectGET(/approval\/current/).respond(savedApproval);
      httpMock.expectPUT(/publishingRecord/).respond(400, {"messages" : {"formId" : [ "Publishing Status submitted Awaiting_Approval does not match current saved Publishing Status " + savedPublishingRecord.status + "." ] } });
      httpMock.expectGET(/approval\/isAdminUser/).respond(true);
      httpMock.expectGET(/approval\/current/).respond(savedApproval);
      
      scope.save();
      expect(scope.updateIndicator).toEqual(true);
      httpMock.flush();
      
      expect(publishingRecordService.update).toHaveBeenCalledWith(savedPublishingRecord2, false);
      expect(scope.errors).toEqual( [ "Publishing Status submitted Awaiting_Approval does not match current saved Publishing Status " + savedPublishingRecord.status + "." ] );
      expect(scope.updateIndicator).toEqual(false);
  });
  
  it('approves an approval to be published', function() {
	  spyOn(windowMock,"confirm").andReturn(true);
	  spyOn(approvalService, "update").andCallThrough();
	  
	  scope.user = currentUser;
	  scope.updateApproval(savedApproval, "Approved");
	  
      expect(approvalService.update).toHaveBeenCalledWith(savedApproval);
      expect(scope.errors.length).toBe(0);
  });
  
  it('makes sure the user has the appropriate permission', function() {
	  scope.permissions = authorities;
      expect(scope.hasPermission(savedApproval)).toBeTruthy();
  });
});

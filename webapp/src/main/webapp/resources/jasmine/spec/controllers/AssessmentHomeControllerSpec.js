describe('AssessmentHomeController ', function() {
  var scope = null;
  var state = null;
  
  var savedAssessment = {
          "id" : "id_12345",
          "name" : "Assessment A"
        };
  
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
   
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, $window, $q) {
        //create a scope object for us to use.
        scope = $rootScope.$new();
        
        // set up expected http requests
        httpMock = $injector.get('$httpBackend');
        httpMock.whenGET(/\.html/).respond("");
        scope.tabs = [{ label:"testTab", select:"assessmenthome.testTab", active:false }];
        scope.tabIndexes = {TEST:0};
        
        // initiate required variables
        state = $state;
        state.$current = {self:""};
        // create controller
        $controller('AssessmentHomeController', {
            $scope : scope,
            $state:state,
            loadedData: {data:savedAssessment, errors:[]}
      });
        
  }));

  /* - TODO - can't figure out why this isn't working
  it('transitions to correct tab view with assessmentId populated when goToTab() called', function(){
      spyOn(state, "transitionTo").andCallThrough();
      scope.goToTab(1,'testTab');
      expect(state.transitionTo).toHaveBeenCalledWith( 'testTab', {"assessmentId":savedAssessment.id});
  });
  */
  
  it('transitions to search screen when cancel() called', function(){
      spyOn(state, "transitionTo");
      
      scope.cancel();
      expect(state.transitionTo).toHaveBeenCalledWith( "assessmentsearch" );
  });
  
});


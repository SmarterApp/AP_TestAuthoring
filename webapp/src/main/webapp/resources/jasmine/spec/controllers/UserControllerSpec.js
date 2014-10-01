
describe('Test User Controller ', function() {
  var $scope = null;
  var httpMock = null;
  var currentUserService = null;
  
  var validUserAssetGroup = {
	  "id" : "526587cae4b0fb61cee18114",
	  "tenant" : {
	    "id" : "524af61ae4b0b02763aa320fe0",
	    "name" : "SB",
	    "description" : "Smarter Balanced",
	    "type" : "STATE_GROUP",
	    "tenantSubscriptions" : null,
	    "url" : "/tenant/524af61ae4b0b02763aa0fe0"
	  },
	  "component" : {
	    "id" : "525ed008e4b0b4751d01909f",
	    "name" : "TestAuthoring",
	    "url" : "/component/525ed008e4b0b4751d01909f"
	  },
	  "assets" : [ {
	    "name" : "logo",
	    "type" : "IMAGE",
	    "property" : "/assetPool/assetFile/524b00bfe4sdfbe2/sbac.png",
	    "assetFileGridId" : "asdasdfasdf",
	    "assetFileName" : "sbac.png",
	    "fileContentType" : null,
	    "basePath" : "http://sb11-progman-qa.drc-ec2.com/rest/",
	    "url" : "http://sb11-progman-qa.drc-ec2.com/rest//assetPool/assetFile/524b00bfe4sdfbe2/sbac.png"
	  }, {
	    "name" : "headerbackground",
	    "type" : "PROPERTY",
	    "property" : "white",
	    "assetFileGridId" : null,
	    "assetFileName" : null,
	    "fileContentType" : null,
	    "basePath" : "http://sb11-progman-qa.drc-ec2.com/rest/",
	    "url" : "http://sb11-progman-qa.drc-ec2.com/rest/white"
	  } ],
	  "url" : "/assetGroup/526587cae4b0fb61cee18114"
  };
  
  var validUserAssetGroup2 = {
		  "id" : "526587cae4b0fb61cee18114",
		  "tenant" : {
		    "id" : "524af61ae4b0b02763aa0fe0",
		    "name" : "WI",
		    "description" : "State Of Wisconsin",
		    "type" : "STATE",
		    "tenantSubscriptions" : null,
		    "url" : "/tenant/524af61ae4b0b02763aa0fe0"
		  },
		  "component" : {
		    "id" : "525ed008e4b0b4751d01909f",
		    "name" : "TestAuthoring",
		    "url" : "/component/525ed008e4b0b4751d01909f"
		  },
		  "assets" : [ {
		    "name" : "logo",
		    "type" : "IMAGE",
		    "property" : "/assetPool/assetFile/524b00bfe4b0b02763aa7be2/fat_eddie.png",
		    "assetFileGridId" : "524b00bfe4b0b02763aa7be2",
		    "assetFileName" : "fat_eddie.png",
		    "fileContentType" : null,
		    "basePath" : "http://sb11-progman-qa.drc-ec2.com/rest/",
		    "url" : "http://sb11-progman-qa.drc-ec2.com/rest//assetPool/assetFile/524b00bfe4b0b02763aa7be2/fat_eddie.png"
		  }, {
		    "name" : "headerbackground",
		    "type" : "PROPERTY",
		    "property" : "green",
		    "assetFileGridId" : null,
		    "assetFileName" : null,
		    "fileContentType" : null,
		    "basePath" : "http://sb11-progman-qa.drc-ec2.com/rest/",
		    "url" : "http://sb11-progman-qa.drc-ec2.com/rest/green"
		  } ],
		  "url" : "/assetGroup/526587cae4b0fb61cee18114"
	  };
  
  var noAssetGroup = "";
  
  var validTenantContainer = {"searchInput" : {
	    "typeAndValues" : {
	        "STATE_GROUP" : "SB",
	        "STATE" : "MN"
	      }
	    },"tenants" : [ {
	    "id" : "524af617e4b0b02763aa0fc6",
	    "name" : "MN",
	    "description" : "State Of Minnesota",
	    "type" : "STATE",
	    "tenantSubscriptions" : [ {
	      "component" : {
	        "id" : "525ed008e4b0b4751d01909f",
	        "name" : "TestAuthoring",
	        "url" : "/component/525ed008e4b0b4751d01909f"
	      },
	      "inGoodStanding" : true,
	      "renewalDate" : null
	    } ],
	    "url" : "/tenant/524af617e4b0b02763aa0fc6"
	  }, {
	    "id" : "524af615e4b0b02763aa0fad",
	    "name" : "SB",
	    "description" : "Smarter Balanced Consortium",
	    "type" : "STATE_GROUP",
	    "tenantSubscriptions" : [ {
	      "component" : {
	        "id" : "525ed008e4b0b4751d01909f",
	        "name" : "TestAuthoring",
	        "url" : "/component/525ed008e4b0b4751d01909f"
	      },
	      "inGoodStanding" : true,
	      "renewalDate" : null
	    } ],
	    "url" : "/tenant/524af615e4b0b02763aa0fad"
	  } ]
		  
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
  
  beforeEach(inject(function($rootScope, $controller, $injector, $state, $http, CurrentUserService) {
	    //create a scope object for us to use.
	    $scope = $rootScope.$new();
	    httpMock = $injector.get('$httpBackend');
	    //respond nothing for templates....
	    httpMock.whenGET(/\.html/).respond("");
	    
        state = $state;
        state.current = {};
	    
	    userController = $controller('UserController', {
		      $scope : $scope,
		      loadedData : {data:{}, errors:[]}
	    });
	    
	    currentUserService = CurrentUserService;

	    var mockForm = {};
	    mockForm.$setPristine = function(){};
	    $scope.assetGroupForm = mockForm;
	    
  }));
  
  it('loads user assets correctly on page start', function() {
	  httpMock.expectGET(/^user\/applicableTenants/).respond(validTenantContainer);
	  httpMock.expectGET(/^user\/hasPermission/).respond(true);
	  httpMock.expectGET(/^user\/assets/).respond(validUserAssetGroup);
	  httpMock.expectGET(/^user\/assets/).respond(validUserAssetGroup);
	  
	  httpMock.flush();
	  expect($scope.logoImage).toBe("http://sb11-progman-qa.drc-ec2.com/rest//assetPool/assetFile/524b00bfe4sdfbe2/sbac.png");
	  expect($scope.headerbackground['background-color']).toBe("white");
  });
  
});


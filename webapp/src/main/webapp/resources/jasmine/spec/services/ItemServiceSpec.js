describe('User Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var items = [ {
		          "version" : "1.0",
		          "itemType" : "Written Response",
		          "keywords" : "Trucks, Planes",
		          "grade" : "9",
		          "subject" : "MATH",
		          "subjectCategory" : "Algebra",
		          "author" : "Wilbur",
		          "status" : "OP",
		          "tibIdentifier" : "SQA001",
		          "itemDifficulty" : "M",
		          "source" : "SBAC",
		          "identifier" : "apipitem_SQA001",
		          "itemHisoryURI" : "item/apipitem_SQA001/history",
		          "url" : "item/apipitem_SQA001",
		          "itemContentURI" : "/itemContent/apipitem_SQA001?version=1.0"
			  }, {
		          "version" : "1.0",
		          "itemType" : "Written Response",
		          "keywords" : "Cats, Dogs",
		          "grade" : "6",
		          "subject" : "ELA",
		          "subjectCategory" : "Poetry",
		          "author" : "Barney Rubble",
		          "status" : "FT",
		          "tibIdentifier" : "SQA002",
		          "itemDifficulty" : "Easy",
		          "source" : "Bedrock",
		          "identifier" : "apipitem_SQA002",
		          "itemHisoryURI" : "item/apipitem_SQA002/history",
		          "url" : "item/apipitem_SQA002",
		          "itemContentURI" : "/itemContent/apipitem_SQA002?version=1.0"
			  } ];
  
  
  //you need to indicate your module in a test
  beforeEach(module('testauth', function($provide) {
      return $provide.decorator('$state', function () {
          return {
              transitionTo: function (path) {
                  return {};
              }
          };
      });
  }));
    
  beforeEach(inject(function(ItemService, _$httpBackend_) {
      serviceMock = ItemService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make correct GET request when finding by item id', function() {
      httpMock.expectGET(new RegExp('item/SQA001')).respond(201,items[0]);
            
      var returnedPromise = serviceMock.findById("SQA001");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(items[0]);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for items', function() {
      var httpResponse = "found these items";
      httpMock.expectGET(new RegExp('item')).respond(201,httpResponse);

      var searchParams = { "tibIdentifier": "SQA001"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these items");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
});


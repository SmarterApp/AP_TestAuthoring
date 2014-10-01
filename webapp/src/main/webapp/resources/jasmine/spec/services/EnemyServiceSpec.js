describe('Enemy Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedEnemyItem = {
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
  };
  
  var existingEnemyItem = {
		  "id" : "item_id",
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
  };

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
    
  beforeEach(inject(function(EnemyService, _$httpBackend_) {
      serviceMock = EnemyService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");      
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing enemy', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('enemy/item_id', {
		  "id" : "item_id",
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
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingEnemyItem);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new enemy', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('enemy', {
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
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedEnemyItem);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by enemy id', function() {
      httpMock.expectGET(new RegExp('enemy/item_id')).respond(201,existingEnemyItem);
            
      var returnedPromise = serviceMock.findById("item_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingEnemyItem);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for enemys', function() {
      var httpResponse = "found these enemys";
      httpMock.expectGET(new RegExp('enemy(.*)&label=scoring-rule-label')).respond(201,httpResponse);
            
      var searchParams = { "label": "scoring-rule-label"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these enemys");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for enemys2', function() {
      var httpResponse = "found these enemys";
      httpMock.expectGET(new RegExp('enemy(.*)&name=enemy-name')).respond(201,httpResponse);
            
      var searchParams = { "name": "enemy-name" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these enemys");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing enemy', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('enemy/item_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingEnemyItem);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('enemy/item_id', {
		  "id" : "item_id",
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
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingEnemyItem);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
});


describe('Segment Service', function() {
  var httpMock = null;
  var serviceMock = null;
  
  var unsavedSegment = {
          "name" : "Mathematics Segment",
          "label" : "MATH",
          "description" : "This is a segment about numbers."
  };
  
  var existingSegment = {
          "id" : "segment_id",
          "name" : "Mathematics Segment",
          "label" : "MATH",
          "description" : "This is a segment about numbers."
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
    
  beforeEach(inject(function(SegmentService, _$httpBackend_) {
      serviceMock = SegmentService;
      httpMock = _$httpBackend_;
      httpMock.whenGET(/\.html/).respond("");
  }));
  
  //make sure no expectations were missed in your tests (e.g. expectGET or expectPOST)
  afterEach(function() {
      httpMock.verifyNoOutstandingExpectation();
      httpMock.verifyNoOutstandingRequest();
  });
  
  it('should make PUT request when saving an existing segment', function() {
      var httpResponse = "successful PUT";

      httpMock.expectPUT('segment/segment_id', {
          "id": "segment_id",
          "name": "Mathematics Segment",
          "label": "MATH",
          "description": "This is a segment about numbers."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(existingSegment);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful PUT");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make POST request when saving a new segment', function() {
      var httpResponse = "successful POST";

      httpMock.expectPOST('segment', {
          "name": "Mathematics Segment",
          "label": "MATH",
          "description": "This is a segment about numbers."
      }).respond(201,httpResponse);
            
      var returnedPromise = serviceMock.save(unsavedSegment);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful POST");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when finding by segment id', function() {
      httpMock.expectGET(new RegExp('segment/segment_id')).respond(201,existingSegment);
            
      var returnedPromise = serviceMock.findById("segment_id");
      returnedPromise.then(function(response) {
          expect(response.data).toBe(existingSegment);
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for segments', function() {
      var httpResponse = "found these segments";
      httpMock.expectGET(new RegExp('segment(.*)&name=Mathematics(.+)Segment')).respond(201,httpResponse);
            
      var searchParams = { "name": "Mathematics Segment"};
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these segments");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct GET request when searching for segments2', function() {
      var httpResponse = "found these segments";
      httpMock.expectGET(new RegExp('segment(.*)&description=here\'s(.+)a(.+)description&label=MATH&name=Mathematics(.+)Segment')).respond(201,httpResponse);
            
      var searchParams = { "name": "Mathematics Segment", "label": "MATH", "description": "here's a description" };
      
      var returnedPromise = serviceMock.search(searchParams);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("found these segments");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should make correct DELETE request when removing segment', function() {
      var httpResponse = "successful DELETE";
      httpMock.expectDELETE('segment/segment_id').respond(201,httpResponse);
            
      var returnedPromise = serviceMock.remove(existingSegment);
      returnedPromise.then(function(response) {
          expect(response.data).toBe("successful DELETE");
          expect(response.errors).toEqual([]);
      });
      
      httpMock.flush();
  });
  
  it('should handle errors correctly from http responses', function() {
      var httpResponse = {messages: {"field1": ["invalid field1"], "field2" : ["invalid field2"]} };

      httpMock.expectPUT('segment/segment_id', {
          "id": "segment_id",
          "name": "Mathematics Segment",
          "label": "MATH",
          "description": "This is a segment about numbers."
      }).respond(500,httpResponse);
            
      var returnedPromise = serviceMock.save(existingSegment);
      returnedPromise.then(function(response) {
          expect(response.data).toEqual({});
          expect(response.errors).toEqual([ "invalid field1", "invalid field2" ]);
      });
      
      httpMock.flush();
  });
  
  
  
});


BaseService = {
	errorHandler : function (response) {
		var returnVal = {
				data : {},
				errors : [],
				messages:{}
		};
		for (var field in response.data.messages) { //it seems IE8 handles it this way better
			for (var j = 0; j < response.data.messages[field].length; j++) {
				returnVal.errors.push(response.data.messages[field][j]);
			}
		}
        returnVal.messages = response.data.messages;
		return returnVal;
	},

	successHandler: function(response) {
		return  {
				data : response.data,
				errors : [],
				messages : {}
		};
    },
    
    save : function(object){
		if(object.id){
			return this.update(object);
		}else{
			return this.create(object);
		}
	},

	create : function(object) {
		var url = this.getBaseUrl() + this.getResource();
		return this.getHttp()({
				method: "POST",
				url: url,
				data: object
				}).then(this.successHandler, this.errorHandler);
	},

	update : function(object) {
		var url = this.getBaseUrl() + this.getResource() + '/' + object.id;
		return this.getHttp()({
				method: "PUT",
				url: url,
				data: object
				}).then(this.successHandler, this.errorHandler);
	},

	search : function(params){
		var url = this.getBaseUrl() + this.getResource() + '/?_=' + Math.random();
	    return  this.getHttp()({
            method: 'GET',
            url: url,
            params: params
	    }).then(this.successHandler, this.errorHandler);
	},

	remove : function(object){
        return this.getHttp()({
                method: 'DELETE',
                url: this.getBaseUrl() + this.getResource() + '/' + object.id
        }).then(this.successHandler, this.errorHandler);
    },

	findById : function(id){
		var url = this.getBaseUrl() + this.getResource() + '/' + id + '?_=' + Math.random();
		return  this.getHttp().get(url).then(this.successHandler, this.errorHandler);
	}
};

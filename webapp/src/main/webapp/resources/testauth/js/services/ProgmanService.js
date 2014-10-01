testauth.factory("ProgmanService", function($http){
    return {
        errorHandler : function (response) {
            var returnVal = {
                    data : {},
                    errors : []
            };
            for(var field in response.data.messages){
                for(var messages in response.data.messages[field]) {
                    returnVal.errors.push(response.data.messages[field][messages]);
                }
            }
            return returnVal;
        },
        
        successHandler: function(response) {
            return  {
                    data : response.data,
                    errors : []
            };
        },
        
        findTenantsByComponentAndSearchVal : function(componentName,inGoodStanding,searchVal,tenantType,pageableParams) {
            var queryString = '?';
            queryString += (inGoodStanding ? '&inGoodStanding=' + inGoodStanding : '');
            queryString += (searchVal ? '&searchVal=' + searchVal : '');
            queryString += (tenantType ? '&tenantType=' + tenantType : '');
            queryString += (pageableParams.page ? '&page.page=' + pageableParams.page : '');
            queryString += (pageableParams.pageSize ? '&page.size=' + pageableParams.pageSize : '');
            queryString += (pageableParams.pageSort ? '&page.sort=' + pageableParams.pageSort : '');
            queryString += (pageableParams.pageSortDir ? '&page.sort.dir=' + pageableParams.pageSortDir : '');
            
            return $http({
                method: 'GET',
                url: baseUrl + 'progman/tenant/component/name/'+ componentName + queryString + '&_=' + Math.random()
            }).then(this.successHandler, this.errorHandler);
        },
        
        loadAllTenantTypes : function() {
            var url = baseUrl + 'progman/tenantTypes/?_=' + Math.random();
            return $http.get(url).then(this.successHandler, this.errorHandler);
        }
        
    };
});
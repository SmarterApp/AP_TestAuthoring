testauth.factory("PollingService", function($http) {
        var defaultPollingTime = 5000;
        var polls = {};

        return {
            startPolling: function(name, url, pollingTime, callback) {
                // Check to make sure poller doesn't already exist
                if (!polls[name]) {
                    var poller = function() {
                        // add random param to make sure browser doesn't cache response
                        $http.get(url, { params: { '_':Math.random() } } ).then(callback);
                    };
                    poller();
                    polls[name] = setInterval(poller, pollingTime || defaultPollingTime);
                }
            },

            stopPolling: function(name) {
                clearInterval(polls[name]);
                delete polls[name];
            }
        };
});
(function (angular) {

    "use strict";

    app
        .module("FreshApp")
        .factory("Fresh.ResourceFactory",[$resource, resourceFactory]);

    function resourceFactory($resource){
        var vm = this;

        return $resource('', {}, {
            post: {method: 'POST'}
        })

        this.post()
    }
})(angular);

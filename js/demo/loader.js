define(function(require) {
    var Loader = require('flux/resources/loader');
    var TMXHandler = require('flux/contrib/tiled/handler');

    var loader = new Loader();
    loader.add_handler(TMXHandler, 'map');

    return loader;
});

define(function(require, exports) {
    var Tilemap = require('flux/tilemap');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('demo/loader');

    loader.register('tiles_overworld', 'img/overworld.png', 'image');
    loader.register('map_overworld', 'maps/overworld.tmx', 'map');
    var Overworld = function() {
        var map = loader.get('map_overworld');
        Tilemap.call(this, map.layers['Tiles'].grid);
        this.graphic = new TiledGraphic(loader.get('tiles_overworld'),
                                        16, 16, 1, 1);

        // Store game start point.
        var start = map.objectGroups['Regions'].objects[0];
        this.start = {
            x: -start.x,
            y: -start.y
        };

        this.solid = {
            'solid': [202, 323, 57, 50, 201, 177, 178]
        };
    };
    exports.Overworld = Overworld;;
    Overworld.prototype = Object.create(Tilemap.prototype);

    Overworld.prototype.gotoStart = function() {
        this.x = this.start.x;
        this.y = this.start.y;
    };
});

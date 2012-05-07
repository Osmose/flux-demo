define(function(require, exports) {
    var ZeldaTilemap = require('demo/tilemap');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('demo/loader');

    // Lazy-loads Tilemaps
    function TilemapCollection(tilesets) {
        this.tilemaps = {};
        this.registered_tilemaps = {};
        this.tilesets = tilesets;
    };

    TilemapCollection.prototype = {
        // Register a tilemap with this collection.
        register: function(id, map_id, tileset_id, solid, constructor,
                           prototype) {
            var collection = this;
            var tilemap_class = function() {
                var map = loader.get(map_id);
                ZeldaTilemap.call(this, map, 0, 0, 160, 128);
                this.graphic = collection.tilesets[tileset_id];
                this.solid = solid;

                if (constructor !== undefined) {
                    constructor.call(this, map);
                }
            };

            // Init prototype for new class.
            tilemap_class.prototype = Object.create(ZeldaTilemap.prototype);
            for (var key in prototype) {
                if (prototype.hasOwnProperty(key)) {
                    tilemap_class.prototype[key] = prototype[key];
                }
            }

            collection.registered_tilemaps[id] = tilemap_class;
        },

        // Retrieve a tilemap, creating it if it hasn't been created yet.
        get: function(id) {
            if (id in this.tilemaps) {
                return this.tilemaps[id];
            } else if (id in this.registered_tilemaps) {
                this.tilemaps[id] = this.build_tilemap(id);
                return this.tilemaps[id];
            } else {
                return null;
            }
        },

        // Build a new instance of a tilemap.
        build_tilemap: function(id) {
            return new this.registered_tilemaps[id]();
        }
    };

    return TilemapCollection;
});

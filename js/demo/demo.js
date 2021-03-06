define(function(require) {
    var Engine = require('flux/engine');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('demo/loader');
    var TilemapCollection = require('demo/maps');
    var Player = require('demo/player');
    var ZeldaWorld = require('demo/world');

    loader.register('tiles_overworld', 'img/overworld.png', 'image');
    loader.register('tiles_interior', 'img/interior.png', 'image');
    loader.register('map_overworld', 'maps/overworld.tmx', 'map');
    loader.register('map_house_marin', 'maps/houses/house_marin.tmx', 'map');

    loader.loadAll().done(function() {
        var engine = new Engine(160, 144, 3, new ZeldaWorld());
        engine.bg_color = '#FFFF8B';
        engine.camera.height -= 16;

        var maps = new TilemapCollection(createTiledGraphics());
        engine.world.maps = maps;

        // Overworld Map
        maps.register('overworld', 'map_overworld', 'overworld', {
            'solid': [202, 323, 57, 50, 201, 177, 178]
        });

        // Marin's House
        maps.register('house_marin', 'map_house_marin', 'interior', {

        });

        var player = new Player(16, 16);
        engine.world.player = player;
        engine.addEntity(player);
        engine.world.tilemap = maps.get('overworld');
        engine.world.tilemap.setCell(1, 1);
        engine.world.hud.moveToBottom();
        engine.world.sounds.mabe_village.loop();

        document.querySelector('#game').appendChild(engine.canvas);
        engine.start();
    });

    function createTiledGraphics() {
        var graphics = {};
        var overworld = new TiledGraphic(loader.get('tiles_overworld'),
                                         16, 16, 1, 1);
        graphics.overworld = overworld;
        overworld.addAnimationName(376, [376, 15, 377, 15, 378, 15, 379, 15]);

        var interior = new TiledGraphic(loader.get('tiles_interior'),
                                        16, 16, 1, 1);
        graphics.interior = interior;

        return graphics;
    }
});

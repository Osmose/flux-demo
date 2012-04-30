define(function(require) {
    var Engine = require('flux/engine');

    var loader = require('demo/loader');
    var maps = require('demo/maps');
    var Player = require('demo/player');
    var ZeldaWorld = require('demo/world');

    loader.loadAll().done(function() {
        var engine = new Engine(160, 144, 3, new ZeldaWorld());
        engine.bg_color = '#FFFF8B';
        engine.camera.height -= 16;

        var player = new Player(16, 16);
        engine.world.player = player;
        engine.addEntity(player);
        engine.world.tilemap = new maps.Overworld();
        engine.world.tilemap.gotoStart();

        document.querySelector('#game').appendChild(engine.canvas);
        engine.start();
    });
});

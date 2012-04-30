define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('demo/loader');
    var Slide = require('demo/transitions').Slide;

    loader.register('link', 'img/link.png', 'image');

    function Player(x, y) {
        Entity.call(this, x, y);
        this.setHitbox(3, 3, 10, 11);

        this.graphic = new TiledGraphic(loader.get('link'), 16, 16);
        this.graphic.addTilename('down', 0);
        this.graphic.currentTile = 'down';
    }

    Player.prototype = Object.create(Entity.prototype);

    Player.prototype.tick = function() {
        var kb = this.engine.kb;
        var collideTilemap = this.collideTilemap.bind(this,
                                                      this.world.tilemap);

        var dx = 0;
        var dy = 0;
        if (kb.check(kb.RIGHT)) dx += 1;
        if (kb.check(kb.LEFT)) dx -= 1;
        if (kb.check(kb.UP)) dy -= 1;
        if (kb.check(kb.DOWN)) dy += 1;

        var within_camera = this.withinCamera(dx, dy);
        if (within_camera != true) {
            this.world.transition(Slide, within_camera);
        }

        if (!collideTilemap('solid', dx, 0)) this.x += dx;
        if (!collideTilemap('solid', 0, dy)) this.y += dy;
    };

    return Player;
});

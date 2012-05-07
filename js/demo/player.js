define(function(require) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('demo/loader');
    var Slide = require('demo/transitions').Slide;
    var Fade = require('demo/transitions').Fade;

    loader.register('link', 'img/link.png', 'image');

    function Player(x, y) {
        Entity.call(this, x, y);
        this.setHitbox(3, 3, 10, 11);

        this.graphic = new TiledGraphic(loader.get('link'), 16, 16);
        this.graphic.addTileName('down', 0);
        this.graphic.addTileName('up', 2);
        this.graphic.addTileName('left', 4);
        this.graphic.addTileName('right', 6);
        this.graphic.addAnimationName('walk_down', [1, 10, 0, 10]);
        this.graphic.addAnimationName('walk_up', [3, 10, 2, 10]);
        this.graphic.addAnimationName('walk_left', [5, 10, 4, 10]);
        this.graphic.addAnimationName('walk_right', [7, 10, 6, 10]);

        this.direction = 'down';
        this.walking = false;
    }

    Player.prototype = Object.create(Entity.prototype);

    Player.prototype.tick = function() {
        Entity.prototype.tick.call(this);
        var kb = this.engine.kb;
        var collideTilemap = this.collideTilemap.bind(this,
                                                      this.world.tilemap);

        var dx = 0;
        var dy = 0;
        if (kb.check(kb.RIGHT)) {
            dx += 1;
            this.direction = 'right';
        }
        if (kb.check(kb.LEFT)) {
            dx -= 1;
            this.direction = 'left';
        }
        if (kb.check(kb.UP)) {
            dy -= 1;
            this.direction = 'up';
        }
        if (kb.check(kb.DOWN)) {
            dy += 1;
            this.direction = 'down';
        }

        // Walking state
        this.walking = dx !== 0 || dy !== 0;

        // Sprite
        var tile = (this.walking ? 'walk_' : '') + this.direction;
        this.graphic.currentTile = tile;

        var within_camera = this.withinCamera(dx, dy);
        if (within_camera != true) {
            this.world.transition(Slide, within_camera);
        }

        var door = this.getCollideEntity('door', dx, dy);
        if (door !== false) {
            this.world.transition(Fade, door);
        };

        if (!collideTilemap('solid', dx, 0)) this.x += dx;
        if (!collideTilemap('solid', 0, dy)) this.y += dy;
    };

    return Player;
});

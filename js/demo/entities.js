define(function(require, exports) {
    var Entity = require('flux/entity');
    var TiledGraphic = require('flux/graphics/tiled');

    var loader = require('demo/loader');

    function ZeldaEntity(x, y) {
        Entity.call(this, x, y);
        this.orig_x = x;
        this.orig_y = y;
    }
    ZeldaEntity.prototype = Object.create(Entity.prototype);
    ZeldaEntity.prototype.reset = function() {
        this.x = this.orig_x;
        this.y = this.orig_y;
    };

    function Door(x, y, width, height, to, to_x, to_y) {
        ZeldaEntity.call(this, x, y);
        this.setHitbox(0, 0, width, height);
        this.type = 'door';
        this.to = to;
        this.to_x = to_x;
        this.to_y = to_y;
    }
    Door.prototype = Object.create(ZeldaEntity.prototype);
    exports.Door = Door;


    loader.register('fly', 'img/fly.png', 'image');
    function Fly(x, y) {
        ZeldaEntity.call(this, x, y);
        this.graphic = new TiledGraphic(loader.get('fly'), 8, 8);
        this.graphic.addAnimationName('fly', [0, 10, 1, 10]);
        this.graphic.currentTile = 'fly';
    }
    Fly.prototype = Object.create(Entity.prototype);
    exports.Fly = Fly;
    Fly.prototype.tick = function() {
        ZeldaEntity.prototype.tick.call(this);
        var range = 100;
        this.angle += (((Math.random() * range) - (range / 2)) % 360);

        this.speed += (Math.random() * 0.05);
        if (this.speed < 0) this.speed = 0;
        if (this.speed > 0.4) this.speed = 0.2;

        var rad = this.angle * (Math.PI / 180);
        var dx = Math.cos(rad) * this.speed;
        var dy = Math.sin(rad) * this.speed;

        this.x += dx;
        this.y += dy;
    };
    Fly.prototype.reset = function() {
        ZeldaEntity.prototype.reset.call(this);
        this.speed = 0.3;
        this.angle = 90;
    };
});

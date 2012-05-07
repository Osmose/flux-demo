define(function(require) {
    var DefaultWorld = require('flux/worlds/default');

    function ZeldaWorld() {
        DefaultWorld.call(this);

        this._tilemap = null;
        this._transition = null;
        this.alpha = 0;
    }

    ZeldaWorld.prototype = Object.create(DefaultWorld.prototype);

    ZeldaWorld.prototype.tick = function() {
        if (this._transition !== null) {
            var done = this._transition.step();
            if (done) {
                this._transition = null;
            }
        } else {
            DefaultWorld.prototype.tick.call(this);
        }
    };

    ZeldaWorld.prototype.render = function(ctx) {
        if (this.tilemap !== null) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);

        // Fade
        ctx.fillStyle = 'rgba(255,255,255,'+this.alpha+')';
        ctx.fillRect(0, 0, this.engine.width, this.engine.height);
    };

    ZeldaWorld.prototype.transition = function(transition) {
        var transition_args = Array.prototype.slice.call(arguments, 1);
        this._transition = new transition(this, transition_args);
    };

    ZeldaWorld.prototype.__defineGetter__('tilemap', function() {
        return this._tilemap;
    });
    ZeldaWorld.prototype.__defineSetter__('tilemap', function(tilemap) {
        if (this._tilemap !== null) {
            this._tilemap.world = null;
            this._tilemap.engine = null;

            this._tilemap.removeEntities(this.engine);
        }

        this._tilemap = tilemap;
        tilemap.world = this;
        tilemap.engine = this.engine;
        tilemap.addEntities(this.engine);
    });

    return ZeldaWorld;
});

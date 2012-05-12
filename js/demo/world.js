define(function(require) {
    var $ = require('jquery');

    var DefaultWorld = require('flux/worlds/default');
    var Sound = require('flux/sound');

    var HUD = require('demo/hud');
    var loader = require('demo/loader');

    loader.register('mabe_village', 'audio/mabe_village.ogg', 'audio');
    loader.register('house', 'audio/house.ogg', 'audio');
    loader.register('stairs', 'audio/sfx/stairs.ogg', 'audio');

    function ZeldaWorld() {
        DefaultWorld.call(this);

        this._tilemap = null;
        this._transition = null;
        this.alpha = 0;

        this.hud = new HUD(this);

        this.sounds = {
            mabe_village: new Sound(loader.get('mabe_village')),
            house: new Sound(loader.get('house')),
            stairs: new Sound(loader.get('stairs'))
        };
        this.bg = null;
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

        if (this.tilemap !== null) {
            this.tilemap.graphic.incAllFrames();
        }
    };

    ZeldaWorld.prototype.render = function(ctx) {
        if (this.tilemap !== null) {
            this.tilemap.render(ctx);
        }

        DefaultWorld.prototype.render.call(this, ctx);

        this.hud.render(ctx);

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

    ZeldaWorld.prototype.start = function() {
        $.each(this.sounds, function(id, sound) {
            sound.unmute();
        });
    };

    ZeldaWorld.prototype.stop = function() {
        $.each(this.sounds, function(id, sound) {
            sound.mute();
        });
    };

    return ZeldaWorld;
});

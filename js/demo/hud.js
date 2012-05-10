define(function(require) {
    var TiledGraphic = require('flux/graphics/tiled');
    var Util = require('flux/util');

    var loader = require('demo/loader');

    loader.register('hearts', 'img/hearts.png', 'image');
    loader.register('hud', 'img/hud.png', 'image');
    loader.register('font', 'img/font.png', 'image');

    function HUD(world) {
        this.x = 0;
        this.y = 0;

        this.world = world;
        this.font = new TiledGraphic(loader.get('font'), 8, 8);
        this.hearts = new TiledGraphic(loader.get('hearts'), 8, 8);
        this.hud_graphic = loader.get('hud');
    }

    HUD.prototype = Object.create({
        FULL_HEART: 0,
        HALF_HEART: 1,
        EMPTY_HEART: 2,
        bg: '#FFFF8B',
        render: function(ctx) {
            ctx.save();
            ctx.fillStyle = this.bg;
            ctx.fillRect(this.x, this.y, 160, 16);
            ctx.drawImage(this.hud_graphic, this.x, this.y);

            this.renderHealth(ctx, this.x + 104, this.y);
            this.renderMoney(ctx, this.x + 80, this.y + 8);

            ctx.restore();
        },

        renderHealth: function(ctx, x, y) {
            var hx = x;
            var hy = y;
            var health = this.world.player.health;
            var max_health = this.world.player.max_health;

            for (var k = 0; k < max_health; k++) {
                // Determine which heart to draw
                var tile = this.EMPTY_HEART;
                if (k < health) {
                    if (k + 1 > health) {
                        tile = this.HALF_HEART;
                    } else {
                        tile = this.FULL_HEART;
                    }
                }

                this.hearts.renderTile(ctx, tile, hx, hy);
                hx += 8;

                // Second row
                if (k === 7) {
                    hy += 8;
                    hx = x;
                }
            }
        },

        renderMoney: function(ctx, x, y) {
            // Zero pad money string
            var money = '' + this.world.player.money;
            var padding = '';

            for (var k = 3; k > money.length; k--) {
                padding += '0';
            }

            Util.renderText(ctx, padding + money, x, y, this.font, 24);
        },

        moveToBottom: function() {
            this.x = 0;
            this.y = this.world.engine.camera.height;
        }
    });

    return HUD;
});

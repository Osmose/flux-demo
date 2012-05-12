define(function(require, exports) {
    function Slide(world, args) {
        this.world = world;
        this.direction = args[0]; // TODO: This is ugly.
        this.length = 32;
        this.frame = 0;
        this.cell_x = world.tilemap.cell_x;
        this.cell_y = world.tilemap.cell_y;

        var old_music = world.tilemap.music[this.cell_y][this.cell_x];

        this.camera = world.engine.camera;
        this.player = world.player;

        // Calculate rate of change.
        this.camera_dx = this.camera.width / this.length;
        this.camera_dy = this.camera.height / this.length;
        this.player_dx = 15 / this.length;
        this.player_dy = 15 / this.length;

        // Store final positions.
        this.done = {
            camera: {
                x: this.camera.x,
                y: this.camera.y
            },
            player: {
                x: this.player.x,
                y: this.player.y
            }
        };
        switch (this.direction) {
        case 'left':
            this.done.player.x += (this.camera.width - 15);
            this.cell_x -= 1;
            break;
        case 'right':
            this.done.player.x -= (this.camera.width - 15);
            this.cell_x += 1;
            break;
        case 'up':
            this.done.player.y += (this.camera.height - 15);
            this.cell_y -= 1;
            break;
        case 'down':
            this.done.player.y -= (this.camera.height - 15);
            this.cell_y += 1;
            break;
        }

        this.world.tilemap.removeEntities(this.world.engine);

        var new_music = world.tilemap.music[this.cell_y][this.cell_x];
        if (old_music !== new_music) {
            var new_sound = world.sounds[new_music];
            world.sounds[old_music].fade(0, 300).done(function() {
                new_sound.audio.volume = 0;
                new_sound.stop();
                new_sound.fade(1, 300);
            });
        }
    }
    exports.Slide = Slide;

    Slide.prototype = {
        step: function() {
            switch (this.direction) {
            case 'left':
                this.camera.x -= this.camera_dx;
                this.player.x -= this.player_dx;
                break;
            case 'right':
                this.camera.x += this.camera_dx;
                this.player.x += this.player_dx;
                break;
            case 'up':
                this.camera.y -= this.camera_dy;
                this.player.y -= this.player_dy;
                break;
            case 'down':
                this.camera.y += this.camera_dy;
                this.player.y += this.player_dy;
                break;
            }

            this.frame++;
            if (this.frame >= this.length) {
                this.complete();
                return true;
            }

            return false;
        },
        complete: function() {
            this.camera.x = this.done.camera.x;
            this.camera.y = this.done.camera.y;
            this.player.x = this.done.player.x;
            this.player.y = this.done.player.y;
            this.world.tilemap.setCell(this.cell_x, this.cell_y, false);
            this.world.tilemap.addEntities(this.world.engine);
        }
    };

    function Fade(world, args) {
        this.world = world;
        this.length = 64;
        this.frame = 0;

        this.door = args[0];
        this.new_tilemap = world.maps.get(this.door.to);
        this.new_tilemap.setCell(this.door.cell_x, this.door.cell_y, false);

        this.old_music = world.tilemap.currentMusic();
        this.new_music = this.new_tilemap.musicForCell(this.door.cell_x,
                                                       this.door.cell_y);
        if (this.old_music !== this.new_music) {
            world.sounds[this.old_music].fade(0, 300);
        }

        this.camera = world.engine.camera;
        this.player = world.player;
    }
    exports.Fade = Fade;

    Fade.prototype = {
        step: function() {
            var world = this.world;
            if (this.frame < 16) {
                world.alpha = this.frame / 16;
            } else if (this.frame < 48) {
                world.alpha = 1;
            } else {
                if (this.frame < 64) {
                    world.alpha = (64 - this.frame) / 16;
                } else {
                    world.alpha = 0;
                }
            }

            if (this.frame === 32) {
                world.tilemap = this.new_tilemap;
                this.player.x = this.door.to_x;
                this.player.y = this.door.to_y;

                if (this.old_music !== this.new_music) {
                    var new_sound = world.sounds[this.new_music];
                    new_sound.audio.volume = 0;
                    new_sound.stop();
                    new_sound.fade(1, 300);
                }
            }

            this.frame++;
            if (this.frame >= this.length) {
                return true;
            }

            return false;
        }
    };
});

define(function(require, exports) {
    function Slide(world, args) {
        this.world = world;
        this.direction = args[0]; // TODO: This is ugly.
        this.length = 64;
        this.frame = 0;

        this.camera = world.engine.camera;
        this.player = world.player;

        // Calculate rate of change.
        this.camera_dx = this.camera.width / this.length;
        this.camera_dy = (this.camera.height - 16) / this.length;
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
            this.done.camera.x -= this.camera.width;
            this.done.player.x -= 15;
            break;
        case 'right':
            this.done.camera.x += this.camera.width;
            this.done.player.x += 15;
            break;
        case 'up':
            this.done.camera.y -= this.camera.height - 16;
            this.done.player.y -= 15;
            break;
        case 'down':
            this.done.camera.y += this.camera.height - 16;
            this.done.player.y += 15;
            break;
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
        }
    };
});

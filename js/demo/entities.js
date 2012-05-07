define(function(require, exports) {
    var Entity = require('flux/entity');

    function Door(x, y, width, height, to, to_x, to_y) {
        Entity.call(this, x, y);
        this.setHitbox(0, 0, width, height);
        this.type = 'door';
        this.to = to;
        this.to_x = to_x;
        this.to_y = to_y;
    }
    Door.prototype = Object.create(Entity.prototype);
    exports.Door = Door;
});

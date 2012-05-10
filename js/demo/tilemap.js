define(function(require) {
    var Tilemap = require('flux/tilemap');

    var entities = require('demo/entities');

    function ZeldaTilemap(map, x, y, cell_width, cell_height) {
        var self = this;
        Tilemap.call(this, map.layers['tiles'].grid, x, y);
        this.cell_width = cell_width;
        this.cell_height = cell_height;
        this.cell_x = 0;
        this.cell_y = 0;

        // Init entity containers. First index is the cell_y coordinate,
        // second is cell_x.
        this.entities = [];
        for (var ty = 0; ty < this.heightTiles; ty++) {
            this.entities[ty] = [];
            for (var tx = 0; tx < this.widthTiles; tx++) {
                this.entities[ty][tx] = [];
            }
        }

        var map_entities = map.objectGroups['entities'].objects;
        map_entities.forEach(function(entity) {
            var cell_x = Math.floor(entity.x / cell_width);
            var cell_y = Math.floor(entity.y / cell_height);
            var x = entity.x % cell_width;
            var y = entity.y % cell_height;

            if (entity.type === 'door') {
                var door = new entities.Door(x, y,
                    entity.width, entity.height,
                    entity.properties.to,
                    parseInt(entity.properties.x),
                    parseInt(entity.properties.y));
                self.entities[cell_y][cell_x].push(door);
            } else if (entity.type === 'entity') {
                var type = entity.properties.type;
                self.entities[cell_y][cell_x].push(new entities[type](x, y));
            }
        });
    }

    ZeldaTilemap.prototype = Object.create(Tilemap.prototype);

    ZeldaTilemap.prototype.setCell = function(cell_x, cell_y, handle_entities) {
        if (handle_entities === undefined) handle_entities = true;
        if (handle_entities && this.engine) {
            this.removeEntities(this.engine);
        }

        this.cell_x = cell_x;
        this.cell_y = cell_y;

        this.x = -(cell_x * this.cell_width);
        this.y = -(cell_y * this.cell_height);

        if (handle_entities && this.engine) {
            this.addEntities(this.engine);
        }
    };

    ZeldaTilemap.prototype.addEntities = function(engine) {
        this.entities[this.cell_y][this.cell_x].forEach(function(entity) {
            engine.addEntity(entity);
            entity.reset();
        });
    };

    ZeldaTilemap.prototype.removeEntities = function(engine) {
        this.entities[this.cell_y][this.cell_x].forEach(function(entity) {
            engine.removeEntity(entity);
        });
    };

    return ZeldaTilemap;
});

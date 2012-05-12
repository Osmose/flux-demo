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

        this.height_cells = Math.floor(map.height_pixels / this.cell_height);
        this.width_cells = Math.floor(map.width_pixels / this.cell_height);

        // Init entity containers. First index is the cell_y coordinate,
        // second is cell_x.
        this.entities = [];
        for (var cy = 0; cy < this.height_cells; cy++) {
            this.entities[cy] = [];
            for (var cx = 0; cx < this.width_cells; cx++) {
                this.entities[cy][cx] = [];
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
                    parseInt(entity.properties.y),
                    parseInt(entity.properties.cell_x),
                    parseInt(entity.properties.cell_y));
                self.entities[cell_y][cell_x].push(door);
            } else if (entity.type === 'entity') {
                var type = entity.properties.type;
                self.entities[cell_y][cell_x].push(new entities[type](x, y));
            }
        });

        // Store what music should play in each cell.
        this.music = [];
        for (cy = 0; cy < this.height_cells; cy++) {
            this.music[cy] = [];
            for (cx = 0; cx < this.width_cells; cx++) {
                this.music[cy][cx] = null;
            }
        }

        var map_music_areas = map.objectGroups['music'].objects;
        map_music_areas.forEach(function(music_area) {
            var area_x = Math.floor(music_area.x / cell_width);
            var area_y = Math.floor(music_area.y / cell_height);
            var area_width = Math.floor(music_area.width / cell_width);
            var area_height = Math.floor(music_area.height / cell_height);

            for (cy = 0; cy < area_height; cy++) {
                for (cx = 0; cx < area_width; cx++) {
                    self.music[area_y + cy][area_x + cx] = music_area.type;
                }
            }
        });
    }

    ZeldaTilemap.prototype = Object.create(Tilemap.prototype);

    ZeldaTilemap.prototype.setCell = function(cell_x, cell_y, handle_entities) {
        var world = this.world;

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

    ZeldaTilemap.prototype.currentMusic = function() {
        return this.music[this.cell_y][this.cell_x];
    };

    ZeldaTilemap.prototype.musicForCell = function(cell_x, cell_y) {
        return this.music[cell_y][cell_x];
    };

    return ZeldaTilemap;
});

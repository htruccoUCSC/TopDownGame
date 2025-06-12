window.my = window.my || { sprite: {} };

import Player from '../sprites/Player.js';

class Game extends Phaser.Scene {
    constructor() {
        super("game");
        this.gridSize = 40 * 16;
        this.zoomLevel = 20 * 16;
        this.currentGridX = 0;
        this.currentGridY = 0;
        this.isTransitioning = false;
        this.currentBounds = { x: 0, y: 0 };
    }

    preload(){
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        this.map = this.add.tilemap("platformer-level-1", 16, 16, 120, 60);
        this.lavaTileset = this.map.addTilesetImage("lavatileset", "lava_tiles");
        this.decoTileset = this.map.addTilesetImage("decorative_tiles", "decorative_tiles");
        this.backgroundLayer = this.map.createLayer("background-layer", this.lavaTileset, 0, 0);
        this.walkingLayer = this.map.createLayer("walking-layer", [this.lavaTileset, this.decoTileset], 0, 0);
        this.detailLayer = this.map.createLayer("detail-layer", [this.lavaTileset, this.decoTileset], 0, 0);
        this.miscLayer = this.map.createLayer("misc-layer", [this.lavaTileset, this.decoTileset], 0, 0);

        this.walkingLayer.setCollisionByProperty({ walkable: false });
        this.backgroundLayer.setCollisionByProperty({ walkable: false });
        this.detailLayer.setCollisionByProperty({ walkable: false });
        this.miscLayer.setCollisionByProperty({ walkable: false });

        this.animatedTiles.init(this.map);

        my.sprite.player = new Player(this, 103, 50);
        
        this.physics.add.collider(my.sprite.player, this.walkingLayer);
        this.physics.add.collider(my.sprite.player, this.backgroundLayer);
        this.physics.add.collider(my.sprite.player, this.detailLayer);
        this.physics.add.collider(my.sprite.player, this.miscLayer);

        this.cameras.main.setZoom(this.cameras.main.width / this.zoomLevel);
        this.cameras.main.setBounds(0, 0, this.gridSize, this.gridSize);
        this.cameras.main.startFollow(my.sprite.player);

        this.cameras.main.on("followupdate", (camera) => {
            const newGridX = Math.floor(my.sprite.player.x / this.gridSize);
            const newGridY = Math.floor(my.sprite.player.y / this.gridSize);

            if ((newGridX !== this.currentGridX || newGridY !== this.currentGridY) && !this.isTransitioning) {
                this.isTransitioning = true;
                this.currentGridX = newGridX;
                this.currentGridY = newGridY;

                const minX = newGridX * this.gridSize;
                const minY = newGridY * this.gridSize;

                this.cameras.main.stopFollow();

                this.tweens.add({
                    targets: this.currentBounds,
                    x: minX,
                    y: minY,
                    duration: 500,
                    ease: 'Power2',
                    onUpdate: () => {
                        this.cameras.main.setBounds(
                            this.currentBounds.x,
                            this.currentBounds.y,
                            this.gridSize,
                            this.gridSize
                        );
                    },
                    onComplete: () => {
                        this.cameras.main.startFollow(my.sprite.player);
                        this.isTransitioning = false;
                    }
                });
            }
        });

        // ENEMIES
        this.swordman = this.physics.add.sprite(300, 130, "swordman").setScale(0.7);
        this.swordman.flipX = true;
        this.swordman.body.immovable = true;
        this.swordman.health = 5;

        this.physics.add.overlap(my.sprite.player, this.swordman, () => {
            my.sprite.player.takeDamage();
        });

        this.physics.add.overlap(my.sprite.player.getBullets(), this.swordman, (swordman, bullet) => {
            bullet.active = false;
            bullet.visible = false;
            bullet.destroy();
            this.swordman.health -= 1;

            if (swordman.health == 0) {
                swordman.destroy();
            }
        });
    }

    update() {
        my.sprite.player.update(this.walkingLayer);
        console.log();
    }
}

export default Game;
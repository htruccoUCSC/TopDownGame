window.my = window.my || { sprite: {} };

import Bullet from '../sprites/Bullet.js';

class Game extends Phaser.Scene {
    constructor() {
        super("game");
        this.gridSize = 40 * 16;
        this.zoomLevel = 20 * 16;
        this.currentGridX = 0;
        this.currentGridY = 0;
        this.isTransitioning = false;
        this.currentBounds = { x: 0, y: 0 };
        this.lastDirection = { x: 1, y: 0 };
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

        my.sprite.player = this.physics.add.sprite(103, 50, "walk_down", 0);
        my.sprite.player.body.setSize(14, 14);
        my.sprite.player.body.setOffset(0, 10);
        
        this.physics.add.collider(my.sprite.player, this.walkingLayer);
        this.physics.add.collider(my.sprite.player, this.backgroundLayer);
        this.physics.add.collider(my.sprite.player, this.detailLayer);
        this.physics.add.collider(my.sprite.player, this.miscLayer);

        this.aKey = this.input.keyboard.addKey('A');
        this.wKey = this.input.keyboard.addKey('W');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');

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


        // BULLETS 

        this.bullets = this.physics.add.group();

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                const { x: dirX, y: dirY } = this.lastDirection;
                if (dirX !== 0 || dirY !== 0) {
                    const bullet = new Bullet(
                        this,
                        my.sprite.player.x,
                        my.sprite.player.y,
                        dirX,
                        dirY
                    );
                    this.bullets.add(bullet);
                }
            }
        });

        // ENEMIES
        
        this.swordman = this.physics.add.sprite(300, 130, "swordman").setScale(0.7);
        this.swordman.flipX = true;
        this.swordman.body.immovable = true;
        this.swordman.health = 5;

        this.playerHealth = 3; // player health placeholder

        // Player collision detection
        this.physics.add.collider(my.sprite.player, this.swordman, () => {
            if (!this.playerInvincible) {
                this.playerHealth -= 1;
                this.playerInvincible = true;

                this.time.delayedCall(1000, () => {
                    this.playerInvincible = false;
                });
            }
            if (this.playerHealth <= 0) {
                this.scene.restart();
            }
        });

        // Bullet collision detection --> need fixing
        this.physics.add.overlap(this.bullets, this.swordman, (bullet, swordman) => {
            bullet.destroy();
            this.swordman.health -= 1;

            console.log("Swordman health:", this.swordman.health);
            if (swordman.health <= 0) {
                console.log("Swordman defeated!");
                swordman.destroy();
            }
        });

    }

    update() {
        let vx = 0;
        let vy = 0;

        const tileX = this.walkingLayer.worldToTileX(my.sprite.player.x);
        const tileY = this.walkingLayer.worldToTileY(my.sprite.player.y);
        const tile = this.walkingLayer.getTileAt(tileX, tileY);

        const canMove = !tile || tile.properties.walkable;

        if (canMove) {
            if (this.aKey.isDown) vx -= 1;
            if (this.dKey.isDown) vx += 1;
            if (this.wKey.isDown) vy -= 1;
            if (this.sKey.isDown) vy += 1;
        }

        if (vx !== 0 || vy !== 0) {
            const length = Math.sqrt(vx * vx + vy * vy);
            this.lastDirection.x = vx / length;
            this.lastDirection.y = vy / length;
        }

        my.sprite.player.setVelocity(vx * 100, vy * 100);
        
        //walks left up
        if (vx < 0 && vy < 0){
            my.sprite.player.anims.play("walk_left_up", true);
        //walks right up
        } else if (vx > 0 && vy < 0){
            my.sprite.player.anims.play("walk_right_up", true);
        //walks up
        } else if (vx == 0 && vy < 0){
            my.sprite.player.anims.play("walk_back", true);
        //walks down
        } else if (vx == 0 && vy > 0){
            my.sprite.player.anims.play("walk_down", true);
        //walks left or walks left down
        } else if ((vx < 0 && vy > 0) || (vx < 0 && vy == 0)){
            my.sprite.player.anims.play("walk_left", true);
        //walks right or walk right down
        } else if ((vx > 0 && vy > 0) || (vx > 0 && vy == 0)){
            my.sprite.player.anims.play("walk_right", true);
        //plays the idle animation
        } else {
            my.sprite.player.anims.play("idle", true);
        }
    }
}

export default Game;
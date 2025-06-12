window.my = window.my || { sprite: {} };

import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import NPC from '../sprites/NPC.js';

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

        // NPCs
        this.swordman = new NPC(this, 300, 130, 'swordman', [
            "Swordman: It's you again?",
            "Swordman: Fine. Just click your left mouth button to kill me already.",
            "Swordman: Remember, you can also use the E key to interact with other NPCs like me.",
            "Swordman: Hope you can win this time, I am tired of dying to you...",
        ], 3);
        this.swordman_armored = new NPC(this, 160, 470, 'swordman_armored', [
            "Armored Swordman: You want this chest that probably has something in it to level up your character?",
            "Armored Swordman: Well, you will have to defeat me first!",
        ], 5);
        this.swordman_great = new NPC(this, 625, 500, 'swordman_great', [
            "Great Swordman: Oh bruh, it's you. Ok let's get this over with.",
        ], 8);
        this.npcs = this.add.group([this.swordman, this.swordman_armored]);

        // ENEMIES

        my.sprite.spearman = new Enemy(this, 380, 100, "spearman", 3);
        my.sprite.spearman_armored = new Enemy(this, 380, 140, "spearman_armored", 5);
        my.sprite.spearman = new Enemy(this, 380, 180, "spearman", 3);
        my.sprite.flaming_skull = new Enemy(this, 500, 300, "flaming_skull", 2);
        my.sprite.flaming_skull2 = new Enemy(this, 520, 320, "flaming_skull", 2);        
        my.sprite.flaming_skull3 = new Enemy(this, 500, 340, "flaming_skull", 2);        
        my.sprite.flaming_skull4 = new Enemy(this, 515, 365, "flaming_skull", 2);
        my.sprite.flaming_skull5 = new Enemy(this, 495, 390, "flaming_skull", 2);

        my.sprite.spearman_armored1 = new Enemy(this, 457, 457, "spearman_armored", 4);
        my.sprite.archer1 = new Enemy(this, 430, 520, "archer", 3);
        my.sprite.archer2 = new Enemy(this, 450, 530, "archer", 3);
        my.sprite.crossbowman1 = new Enemy(this, 490, 530, "crossbowman", 4);

        my.sprite.swordman_great1 = new Enemy(this, 600, 400, "swordman_great", 5);
        my.sprite.maceman1 = new Enemy(this, 650, 420, "maceman", 5);
        my.sprite.royal_guard1 = new Enemy(this, 700, 440, "royal_guard", 6);
        my.sprite.mage1 = new Enemy(this, 750, 460, "mage", 5);
        my.sprite.mage_hooded1 = new Enemy(this, 800, 480, "mage_hooded", 6);

        my.sprite.royal_guard2 = new Enemy(this, 900, 520, "royal_guard", 7);
        my.sprite.royal_guard3 = new Enemy(this, 950, 540, "royal_guard", 7);
        my.sprite.mage2 = new Enemy(this, 1000, 560, "mage", 6);
        my.sprite.mage_hooded2 = new Enemy(this, 1050, 580, "mage_hooded", 7);
        my.sprite.king = new Enemy(this, 1100, 600, "king", 10);

    }

    update() {
        my.sprite.player.update(this.walkingLayer);
        console.log();
    }
}

export default Game;
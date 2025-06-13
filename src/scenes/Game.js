import { my } from '../main.js';
import Player from '../sprites/Player.js';
import Enemy from '../sprites/Enemy.js';
import NPC from '../sprites/NPC.js';
import Collectible from '../sprites/Collectible.js';

class Game extends Phaser.Scene {
    constructor() {
        super("game");
        this.gridSize = 40 * 16;
        this.zoomLevel = 20 * 16;
        this.currentGridX = 0;
        this.currentGridY = 0;
        this.isTransitioning = false;
        this.currentBounds = { x: 0, y: 0 };
        this.isDialogueActive = false;
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

        //particles
        this.shootVFX = this.add.particles(0,0, "kenny-particles", {
            frame: ['star_09.png'],
            emitting: false,
            scale: {start: 0.03, end: 0.0},
            lifespan: 500,
            alpha: {start: 1, end: 0.1},
            speed: {min: 50, max: 100},
            gravityY: 1000,
            quantity: 3
        });

        this.bloodVFX = this.add.particles(0,0, "blood", {
            frame: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28], //smoke_08.png
            emitting: false,
            scale: {start: 0.5, end: 0.0},
            lifespan: 500,
            speed: {min: 50, max: 100},
            gravityY: 1000,
            quantity: 5
        });



        this.playerSpawn = this.map.findObject(
            "Objects",
            (obj) => obj.name === "playerSpawnPoint"
          );

        my.sprite.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, this.shootVFX);
        
        const numberOfHearts = my.sprite.player.health;
        this.hearts = [];
        for (let i = 0; i < numberOfHearts; i++){
            const heart = this.add.sprite((my.sprite.player.x - ((numberOfHearts -1) * 16)/2 + i * 16),(my.sprite.player.y - 20), "tilemap_packed", 44).setScale(0.5).setOrigin(0.5, 1);
            this.hearts.push(heart);
        }

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
            "Skeleton: It's you again?",
            "Skeleton: Fine. Just click your left mouse button to kill me already.",
            "Skeleton: Remember, you can also use the E key to interact with other NPCs like me.",
            "Skeleton: Hope you can win this time, I am tired of dying to you...",
        ]);
        this.npcs = this.add.group([this.swordman]);

        // ENEMIES
        
        this.enemyGroup = this.physics.add.group();

        const enemySpawns = this.map.filterObjects(
          "Objects",
          (obj) => obj.name.includes("EnemySpawn")
        );

        enemySpawns.forEach(spawnPoint => {
            let enemy;
            switch(spawnPoint.name) {
                case "spearmanEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "spearman", 3, this.bloodVFX);
                    break;
                case "spearmanArmoredEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "spearman_armored", 5, this.bloodVFX);
                    break;
                case "swordmanEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "swordman", 3, this.bloodVFX);
                    break;
                case "swordmanArmoredEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "swordman_armored", 5, this.bloodVFX);
                    break;
                case "mageEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "mage", 3, this.bloodVFX);
                    break;
                case "mageHoodedEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "mage_hooded", 5, this.bloodVFX);
                    break;
                case "bossEnemySpawn":
                    enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, "agis2", 25, this.bloodVFX).setScale(0.65);
            }
            if (enemy) {
                this.enemyGroup.add(enemy);
            }
            
        });

        const collectibleObjects = this.map.filterObjects(
            "Objects",
            (obj) => obj.name === "heart"
          );
          
          this.collectibleGroup = this.physics.add.group();
          collectibleObjects.forEach(obj => {
              const collectible = new Collectible(this, obj.x, obj.y - 8);
              this.collectibleGroup.add(collectible);
          });

          this.physics.add.overlap(
            my.sprite.player,
            this.collectibleGroup,
            (player, heart) => {
                if (player.health < 3) {
                    player.health += 1;
                    heart.destroy();
                    this.sound.play("pickupSound");
                    //this.updateHeartsDisplay();
                } else {
                    this.sound.play("pickupSound");
                    heart.destroy();
                }
            },
            null,
            this
        );
    }

    update() {
        my.sprite.player.update(this.walkingLayer);

        this.enemyGroup.getChildren().forEach(enemy => {
            enemy.update(my.sprite.player);
        });


        //moving hearts with player
        const numberOfHearts = this.hearts ? this.hearts.length : 0;
        if (this.hearts){
            for (let i = 0; i < numberOfHearts; i++){
                this.hearts[i].x = my.sprite.player.x - ((numberOfHearts -1) * 16)/2 + i * 16;
                this.hearts[i].y = my.sprite.player.y - 20;
            }
        }

        //when player takes damage, update hearts accordingly
        this.updateHeartsDisplay();

        

    }
    updateHeartsDisplay () {
        this.hearts.forEach(heart => heart.destroy());
        this.hearts = [];
    
        const numberOfHearts = my.sprite.player.health;
        const spacing = 16;
        const offsetY = 20;
    
        for (let i = 0; i < numberOfHearts; i++){
            const heart = this.add.sprite(
                my.sprite.player.x - ((numberOfHearts -1) * spacing)/2 + i * spacing,
                my.sprite.player.y - offsetY,
                "tilemap_packed", 44).setScale(0.5).setOrigin(0.5, 1);
                this.hearts.push(heart);
            
        }
    }

}




export default Game;
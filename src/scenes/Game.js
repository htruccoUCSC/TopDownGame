class Game extends Phaser.Scene {
    constructor() {
        super("game");
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

        this.animatedTiles.init(this.map);

        my.sprite.player = this.physics.add.sprite(103, 50, "walk_down", 0);

       
        my.sprite.player.setCollideWorldBounds(true);
        


        this.backgroundLayer.setCollisionByProperty({
            collides: true
        });
        this.physics.add.collider(my.sprite.player, this.backgroundLayer);

         this.input.keyboard.on('keydown-R', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.aKey = this.input.keyboard.addKey('A');
        this.wKey = this.input.keyboard.addKey('W');
        this.sKey = this.input.keyboard.addKey('S');
        this.dKey = this.input.keyboard.addKey('D');

    }

    update() {
        
        let vx = 0;
        let vy = 0;

        if (this.aKey.isDown) vx -= 100;
        if (this.dKey.isDown) vx += 100;
        if (this.wKey.isDown) vy -= 100;
        if (this.sKey.isDown) vy += 100;

        my.sprite.player.setVelocity(vx, vy);
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
class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.setPath("./assets/");
        //loading tile sheets
        this.load.spritesheet("lava_tiles", "freelavatileset-Sheet.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("decorative_tiles", "sinnersRiseTilemap.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        // loading character anims
        this.load.spritesheet("walk_down", "walk_Down.png",{
            frameWidth: 12,
            frameHeight: 23        
        });
        //used for left and walk left down
        this.load.spritesheet("walk_left", "walk_Left_Down.png",{
            frameWidth: 16,
            frameHeight: 25
        });
        this.load.spritesheet("walk_left_up", "walk_Left_Up.png",{
            frameWidth: 15,
            frameHeight: 24
        });
        //used for walk right and walk right down
        this.load.spritesheet("walk_right", "walk_Right_Down.png",{
            frameWidth: 16,
            frameHeight: 26
        });
        this.load.spritesheet("walk_right_up", "walk_Right_Up.png",{
            frameWidth: 16,
            frameHeight: 24
        });
        this.load.spritesheet("walk_back", "walk_Up.png",{
            frameWidth: 12,
            frameHeight: 23
        });
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj")
    }

    create() {
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("walk_down", {frames: [0]}),
        });
        this.anims.create({
            key: "walk_down",
            frames: this.anims.generateFrameNumbers("walk_down", {frames: [0,1,2,3,4,5,6]}),
            frameRate: 15,
            repeat: -1
        });
        //used for walking left and left down
        this.anims.create({
            key: "walk_left",
            frames: this.anims.generateFrameNumbers("walk_left", {frames: [0,1,2,3,4,5,6,7]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: "walk_left_up",
            frames: this.anims.generateFrameNumbers("walk_left_up", {frames: [0,1,2,3,4,5,6,7]}),
            frameRate: 15,
            repeat: -1
        });
        //used for walking right and right down
        this.anims.create({
            key: "walk_right",
            frames: this.anims.generateFrameNumbers("walk_right", {frames: [0,1,2,3,4,5,6,7]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: "walk_right_up",
            frames: this.anims.generateFrameNumbers("walk_right_up", {frames: [0,1,2,3,4,5,6,7]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: "walk_back",
            frames: this.anims.generateFrameNumbers("walk_back", {frames: [0,1,2,3,4,5,6,7]}),
            frameRate: 15,
            repeat: -1
        });

        this.scene.start("game");
    }  
}
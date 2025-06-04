class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.spritesheet("lava_tiles", "freelavatileset-Sheet.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("decorative_tiles", "sinnersRiseTilemap.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj")
    }

    create() {
        this.scene.start("game");
    }  
}
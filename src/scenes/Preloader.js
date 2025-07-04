class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.setPath("./assets/");
        //loading tile sheets

        this.load.spritesheet("blood", "blood_particles.png",{
            frameWidth: 100,
            frameHeight: 100
        });
        
        this.load.spritesheet("agis", "Agis.png",{
            frameWidth: 224,
            frameHeight: 240
        });

        this.load.spritesheet("spawn_anim", "spawnAnim.png",{
            frameWidth: 128,
            frameHeight: 128
        });

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
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");
        
        this.load.image("heart", "heart.png"); //temp bullet holder

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // enemy sprites
        this.load.image("swordman", "Skeleton_Swordman Not Armored.png");        
        this.load.image("swordman_armored", "Skeleton_Swordman Armored.png");
        this.load.image("spearman", "Skeleton_Spearman Not Armored.png");        
        this.load.image("spearman_armored", "Skeleton_Spearman Armored.png");
        this.load.image("archer", "Skeleton_Archer.png");
        this.load.image("mage", "Skeleton_Mage Not Hooded.png");
        this.load.image("mage_hooded", "Skeleton_Mage Hooded.png");
        this.load.image("agis2", "Agis2.png");

        //text
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.spritesheet("death", "death.png",{
            frameWidth: 16,
            frameHeight: 28
        });


        //player hearts
        this.load.spritesheet("tilemap_packed", "tilemap_packed.png",{
            frameWidth: 18,
            frameHeight: 18
        });

        //audio
        this.load.audio("shootSound", "powerUp9.ogg");
        this.load.audio("hitSound", "impactPlank_medium_000.ogg");
        this.load.audio("deathSound", "impactBell_heavy_001.ogg");
        this.load.audio("playerDeath", "phaserDown3.ogg");
        this.load.audio("footstep", "footstep_carpet_000.ogg");
        this.load.audio("pickupSound", "impactMining_000.ogg");
        this.load.audio("celebration", "celebration_sound.wav");
    }

    create() {

        //heart anims
        this.anims.create({
            key: "loseHealth",
            frames: this.anims.generateFrameNumbers("tilemap_packed", {frames: [44, 46]}),
            frameRate: 3
        });

        this.anims.create({
            key: "die",
            frames: this.anims.generateFrameNumbers("death", {frames: [0,1,2,3,4,5,6,7]}),
            frameRate: 15
        });

        this.anims.create({
            key: "gainHealth",
            frames: this.anims.generateFrameNumbers("tilemap_packed", {frames: [46, 44]}),
            frameRate: 3
        });

        //Agis animation
        this.anims.create({
            key: "boss",
            frames: this.anims.generateFrameNumbers("agis_anim", {frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]}),
            frameRate: 10,
            repeat: -1
        });
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

        this.scene.start("titleScreen");
    }  
}
export default Preloader;
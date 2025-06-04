class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.add.existing(this);

        this.speed = 260; //tentative speed
        this.setActive(false);
        this.setVisible(false);
    }

    fire(originX, originY, targetX, targetY) {
        
        // makes bullet appear at player's loc
        this.setPosition(originX, originY);
        this.setActive(true);
        this.setVisible(true);

        //calculates direction (origin to target) & sets velocity
        const direction = new Phaser.Math.Vector2(targetX - originX, targetY - originY).normalize();
        this.setVelocity(direction.x * this.speed, direction.y * this.speed);
    }


    update() {
        if (!this.active) return;

        // Kill bullet if it goes out of bounds, turns off
        if (
            this.y < -this.displayHeight ||
            this.y > this.scene.sys.game.config.height + this.displayHeight ||
            this.x < -this.displayWidth ||
            this.x > this.scene.sys.game.config.width + this.displayWidth
        ) {
            this.makeInactive();
        }
    }

    // hides bullet marks it as inactive
    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.setVelocity(0, 0);
    }
}

    // bullet.js takes in whatever sprite as the bullet through the constructor and the player shoots it
    // the way it is shot is that wherever the player drags it's mouse towards is where the bullet would go to, the bullet emits from the player.
    // direction bullets go - origin vs target, bullet goes in direction of target, target is where mouse clicks

    
    //TO ADD INTO MAIN SCENE
    // create() {
    //     // Your existing setup code
    //     this.player = this.physics.add.sprite(100, 100, 'playerSprite');
    
    //     // Create a group for bullets
    //     this.bullets = this.physics.add.group({
    //         classType: Bullet,
    //         runChildUpdate: true, // Ensures update() gets called on bullets
    //         maxSize: 20 // limit pool size
    //     });
    
    //     // Listen for mouse clicks to fire bullets
    //     this.input.on('pointerdown', (pointer) => {
    //         const bullet = this.bullets.get();
    //         if (bullet) {
    //             bullet.fire(this.player.x, this.player.y, pointer.x, pointer.y);
    //         }
    //     });
    // }   
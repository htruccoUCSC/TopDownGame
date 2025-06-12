import Bullet from './Bullet.js';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, shootVFX) {
        super(scene, x, y, "walk_down", 0);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.shootVFX = shootVFX
        this.body.setSize(14, 14);
        this.body.setOffset(0, 10);
        
        this.health = 3;
        this.isInvincible = false;
        this.lastDirection = { x: 1, y: 0 };
        
        this.speed = 100;

        this.bullets = scene.physics.add.group();
        
        this.keys = {
            a: scene.input.keyboard.addKey('A'),
            w: scene.input.keyboard.addKey('W'),
            s: scene.input.keyboard.addKey('S'),
            d: scene.input.keyboard.addKey('D')
        };

        scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.shoot(pointer);
            }
        });
    }


    shoot(pointer) {
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        const bullet = new Bullet(
            this.scene,
            this.x,
            this.y,
            worldPoint.x,
            worldPoint.y,
            {
                texture: 'heart',
                scale: 0.5,
                range: 200,
                duration: 300
            }
        );

        this.bullets.add(bullet);
        this.shootVFX.emitParticleAt(this.x, this.y);
    }

    getBullets() {
        return this.bullets;
    }

    update(walkingLayer) {
        let vx = 0;
        let vy = 0;

        const tileX = walkingLayer.worldToTileX(this.x);
        const tileY = walkingLayer.worldToTileY(this.y);
        const tile = walkingLayer.getTileAt(tileX, tileY);
        const canMove = !tile || tile.properties.walkable;

        if (canMove) {
            if (this.keys.a.isDown) vx -= 1;
            if (this.keys.d.isDown) vx += 1;
            if (this.keys.w.isDown) vy -= 1;
            if (this.keys.s.isDown) vy += 1;
        }

        if (vx !== 0 && vy !== 0) {
            const length = Math.sqrt(vx * vx + vy * vy);
            vx = vx / length;
            vy = vy / length;
        }

        if (vx !== 0 || vy !== 0) {
            this.lastDirection.x = vx;
            this.lastDirection.y = vy;
        }

        this.setVelocity(vx * this.speed, vy * this.speed);
        
        this.updateAnimation(vx, vy);
    }

    updateAnimation(vx, vy) {
        if (vx < 0 && vy < 0) {
            this.anims.play("walk_left_up", true);
        } else if (vx > 0 && vy < 0) {
            this.anims.play("walk_right_up", true);
        } else if (vx === 0 && vy < 0) {
            this.anims.play("walk_back", true);
        } else if (vx === 0 && vy > 0) {
            this.anims.play("walk_down", true);
        } else if ((vx < 0 && vy > 0) || (vx < 0 && vy === 0)) {
            this.anims.play("walk_left", true);
        } else if ((vx > 0 && vy > 0) || (vx > 0 && vy === 0)) {
            this.anims.play("walk_right", true);
        } else {
            this.anims.play("idle", true);
        }
    }

    takeDamage() {
        if (!this.isInvincible) {
            this.health -= 1;
            this.isInvincible = true;

            this.scene.time.delayedCall(1000, () => {
                this.isInvincible = false;
            });

            if (this.health <= 0) {
                this.scene.scene.restart();
            }
        }
    }

    getLastDirection() {
        return this.lastDirection;
    }
}

export default Player;
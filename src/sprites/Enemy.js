import { my } from '../main.js';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, enemytype, health) {
        super(scene, x, y, enemytype);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.health = health;
        this.enemytype = enemytype;
        this.setScale(0.7);
        this.flipX = true;
        this.body.immovable = true;        

        scene.physics.add.collider(my.sprite.player, this);

        scene.physics.add.overlap(my.sprite.player, this, () => {
            my.sprite.player.takeDamage();
        });

        scene.physics.add.overlap(my.sprite.player.getBullets(), this, (enemy, bullet) => {
            bullet.active = false;
            bullet.visible = false;
            bullet.destroy();
            this.health -= 1;

            if (this.health <= 0) {
                this.destroy();
            }
        });
    }
}
export default Enemy;
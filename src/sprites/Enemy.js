import { my } from '../main.js';

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, enemytype, health, bloodVFX) {
        super(scene, x, y, enemytype);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.bloodVFX = bloodVFX;
        this.health = health;
        this.enemytype = enemytype;
        this.setScale(0.7);
        this.flipX = true;
        this.body.immovable = true;    
        this.speed = 30;    


        scene.physics.add.overlap(my.sprite.player, this, () => {
            my.sprite.player.takeDamage();
        });

        

        scene.physics.add.overlap(my.sprite.player.getBullets(), this, (enemy, bullet) => {
            bullet.active = false;
            bullet.visible = false;
            bullet.destroy();

            //play hitting sound
            scene.sound.play("hitSound");

            this.health -= 1;

            this.bloodVFX.emitParticleAt(this.x,this.y);
            if (this.health <= 0) {
                scene.sound.play("deathSound"); //plays sound of death!
                if (enemytype === "agis2"){
                    scene.sound.play("celebration");
                    this.scene.time.delayedCall(1000, () =>{
                        this.scene.scene.start("titleScreen");
                        
                    });
                } else {
                this.destroy();
                }
            }
            
        });

        
    }
    update(player){
        if (player && player.active && !this.scene.isDialogueActive){
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            const chaseRange = 200;
            if (distance <= chaseRange) {
                this.scene.physics.moveToObject(this, player, this.speed);
            } else {
                this.body.setVelocity(0,0);
            }
        } else {
            this.body.setVelocity(0,0);
        }
    }

}
export default Enemy;
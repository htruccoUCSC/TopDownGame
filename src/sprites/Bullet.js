export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, originX, originY, targetX, targetY, options = {}) {
        super(scene, originX, originY, options.texture || 'heart');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const dirX = targetX - originX;
        const dirY = targetY - originY;
        
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        const normX = dirX / length;
        const normY = dirY / length;

        this.setDepth(10);
        this.setScale(options.scale || 0.5);

        scene.tweens.add({
            targets: this,
            x: originX + normX * (options.range || 50),
            y: originY + normY * (options.range || 50),
            duration: options.duration || 200,
            onComplete: () => this.destroy()
        });
    }
}
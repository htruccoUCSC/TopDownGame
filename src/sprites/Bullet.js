export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, dirX, dirY) {
        super(scene, x, y, 'heart');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const length = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const normX = dirX / length;
        const normY = dirY / length;

        this.setDepth(10);
        this.setScale(0.5);

        scene.tweens.add({
            targets: this,
            x: x + normX * 100,
            y: y + normY * 100,
            duration: 300,
            onComplete: () => this.destroy()
        });
    }
}
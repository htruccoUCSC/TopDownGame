import { my } from '../main.js';

class Collectible extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "tilemap_packed", 44);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.2);
        this.setOrigin(0.5, 1);
        this.setImmovable(true);

    }
}

export default Collectible;
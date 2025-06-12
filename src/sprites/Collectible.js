class Collectible extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);


        //health bar
        const numberOfHearts = this.health;
        const hearts = [];
        for (let i = 0; i < numberOfHearts; i++){
            const heart = this.add.sprite(10 + i * 63,10, "tilemap_packed", 44).setScale(2).setOrigin(0);
            hearts.push(heart);
        }

        this.heartObj = this.map.createFromObjects("Objects", {
            name: "heart",
            key: "tilemap_packed",
            frame: 44
        });

        this.heartGroup = this.add.group();
        this.heartObj.forEach(obj => {
            this.physics.world.enable(obj, Phaser.Physics.Arcade.STATIC_BODY);
            this.heartGroup.add(obj);
        })

        this.physics.add.overlap(my.sprite.player, this.heartGroup, (obj1, obj2) => {
            if (this.health === 0){
                return;
            }
            if (this.health === hearts.length){
                obj2.destroy();
                return;
            }
            this.health += 1;
            const heartIndex = this.health - 1;
            hearts[heartIndex].play("gainHealth", true);
            obj2.destroy();

        });
    }
}
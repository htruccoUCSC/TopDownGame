class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, dialogueLines = []) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setScale(0.7);
        this.flipX = true;     

        scene.physics.add.collider(my.sprite.player, this);

        this.dialogueLines = dialogueLines;
        this.dialogueIndex = 0;
        this.isDialogueActive = false;
        this.hasSpoken = false;

        this.dialogueBox = null;
        this.dialogueText = null;

        this.eKey = scene.input.keyboard.addKey('E');
        this.advanceListener = null;
        this.continueText = null;
        this.health = 3;

        // gets rid of NPCs after already interacted with
        scene.physics.add.overlap(my.sprite.player.getBullets(), this, (NPC, bullet) => {
            if(this.hasSpoken){
                bullet.active = false;
                bullet.visible = false;
                bullet.destroy();
                this.health -= 1;

                if (this.health <= 0) {
                    this.destroy();
            }
            }
        });
    }

    startDialogue() {
        if (this.isDialogueActive || this.hasSpoken) return;

        this.isDialogueActive = true;
        this.dialogueIndex = 0;

        this.dialogueBox = this.scene.add.rectangle(
            280, 250, 400, 60, 0x000000, 0.7
        ).setOrigin(0.5);

        this.dialogueText = this.scene.add.text(
            280, 250,
            this.dialogueLines[this.dialogueIndex] || "",
            {
                fontFamily: 'monospace',
                fontSize: '12px',
                fill: '#fff',
                wordWrap: { width: 270 },
                resolution: 10
            }
        ).setOrigin(0.5);

        this.continueText = this.scene.add.text(
            280, 290,
            "Press E to continue",
            {
                fontFamily: 'monospace',
                fontSize: '8px',
                fill: '#fff',
                resolution: 10
            }
        ).setOrigin(0.5);

        this.advanceListener = this.scene.input.keyboard.on('keydown-E', () => {
            this.dialogueIndex++;
            if (this.dialogueIndex < this.dialogueLines.length) {
                this.dialogueText.setText(this.dialogueLines[this.dialogueIndex]);
            } else {
                this.endDialogue();
            }
        });
    }

    endDialogue() {
        this.isDialogueActive = false;
        this.hasSpoken = true;
        if (this.dialogueBox) this.dialogueBox.destroy();
        if (this.dialogueText) this.dialogueText.destroy();
        if (this.continueText) this.continueText.destroy();
        if (this.advanceListener) this.scene.input.keyboard.off('keydown-E', this.advanceListener);
    }
}

export default NPC;
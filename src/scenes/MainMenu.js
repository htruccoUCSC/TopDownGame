import { my, game } from '../main.js';

class MainMenu extends Phaser.Scene {
  constructor() {
    super("titleScreen");
  }

  create() {
    this.add.rectangle(0, 0, game.config.width, game.config.height, 0x87CEEB)
      .setOrigin(0, 0);

    // Add title text
    my.text.title = this.add
      .text(game.config.width / 2, game.config.height / 3, "Top Down Game", {
        fontSize: "64px",
        fill: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // Create start game button
    const startButton = this.add
      .text(game.config.width / 2, game.config.height / 2, "Start Game", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => startButton.setStyle({ fill: "#ffff00" }))
      .on("pointerout", () => startButton.setStyle({ fill: "#ffffff" }))
      .on("pointerdown", () => this.scene.start("game"));

    const controlsButton = this.add
      .text(game.config.width / 2, game.config.height / 2 + 100, "Controls", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => controlsButton.setStyle({ fill: "#ffff00" }))
      .on("pointerout", () => controlsButton.setStyle({ fill: "#ffffff" }))
      .on("pointerdown", () => this.showControls());

    const creditsButton = this.add
      .text(game.config.width / 2, game.config.height / 2 + 200, "Credits", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => creditsButton.setStyle({ fill: "#ffff00" }))
      .on("pointerout", () => creditsButton.setStyle({ fill: "#ffffff" }))
      .on("pointerdown", () => this.showCredits());
  }

  showControls() {
    const controls = [
      "Movement: WASD",
      "Interact: E",
      "Shoot: Left Click",
    ];

    const controlsText = this.add.container(
      game.config.width / 2,
      game.config.height / 2
    );

    const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.8).setOrigin(0.5);
    controlsText.add(bg);

    controls.forEach((text, index) => {
        const textObj = this.add
          .text(0, -100 + index * 50, text, {
            fontSize: "24px",
            fill: "#fff",
          })
          .setOrigin(0.5);
        controlsText.add(textObj);
      });
  
      const controlsCloseButton = this.add
        .text(250, -150, "X", {
          fontSize: "32px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => controlsText.destroy());
  
      controlsText.add(controlsCloseButton);
  }

  showCredits() {
    const credits = [
      "Game created by:",
      "Sonny Trucco",
      "Ava Malinowski",
      "Nayanika Bhattacharya",
      "Kaitlyn Eng",
    ];

    const creditsText = this.add.container(
      game.config.width / 2,
      game.config.height / 2
    );

    const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.8).setOrigin(0.5);
    creditsText.add(bg);

    credits.forEach((text, index) => {
      const textObj = this.add
        .text(0, -100 + index * 50, text, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      creditsText.add(textObj);
    });

    const creditsCloseButton = this.add
      .text(250, -150, "X", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => creditsText.destroy());

    creditsText.add(creditsCloseButton);
  }
}

export default MainMenu;

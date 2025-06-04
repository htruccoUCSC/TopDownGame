"use strict"

let config = {
    parent: "phaser-game",
    type: Phaser.CANVAS,
    render: {
      pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: {
            x: 0,
            y: 0,
          },
        },
      },
      width: 1440,
      height: 720,
      scene: [],
};
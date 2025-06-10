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
      width: 1940,
      height: 920,
      scene: [Preloader, MainMenu, Game, GameOver],
};

var my = { sprite: {}, text: {} };

const game = new Phaser.Game(config);
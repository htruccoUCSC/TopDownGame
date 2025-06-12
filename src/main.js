"use strict"

import Preloader from './scenes/Preloader.js';
import MainMenu from './scenes/MainMenu.js';
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';

export const my = { sprite: {}, text: {} };

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
      width: 1080,
      height: 1080,
      scene: [Preloader, MainMenu, Game, GameOver],
      
};

export const game = new Phaser.Game(config);
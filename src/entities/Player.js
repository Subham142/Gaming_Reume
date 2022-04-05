import Phaser from 'phaser';
import initAnimations from './playerAnims';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    
    //adding the sprite(player imge and all) 
    scene.add.existing(this);

    //adding the functionalities of the player
    scene.physics.add.existing(this);
        
    this.init();
    this.initEvents();
    }

    init() {
    this.gravity = 500;
     //left and right speed
     this.playerSpeed=200;
     //taking instru. form the user
     this.cursors= this.scene.input.keyboard.createCursorKeys();

    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);

    initAnimations(this.scene.anims);
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
      }
    
      
      update() {
    const { left, right } = this.cursors;

    if (left.isDown) {
        this.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
        this.setVelocityX(this.playerSpeed);
    } else {
        this.setVelocityX(0);
    }

    // dont play it again if it's already playing
    // second value -> ignoreIfPlaying
    this.play('idle', true);
  }
}


export default Player;
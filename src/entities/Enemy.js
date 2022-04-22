import Phaser from 'phaser';

import collidable from '../mixins/collidable';
import anims from '../mixins/anims';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    this.config = scene.config;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mixins
    Object.assign(this, collidable);
    Object.assign(this, anims);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 500;
    this.speed = 80;
    this.timeFromLastTurn = 0;
    this.maxPatrolDistance = 250;
    this.currentPatrolDistance = 0;

    this.damage = 10;
    this.health = 30;

    this.platformCollidersLayer = null;
    this.rayGraphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xaa00aa}});

    this.body.setGravityY(this.gravity);
    this.setSize(20, 45);
    this.setOffset(7, 20);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setOrigin(0.5, 1);
    this.setVelocityX(this.speed);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update(time) {
    this.patrol(time);
  }

  patrol(time) {
    if (!this.body || !this.body.onFloor()) { return; }
    this.currentPatrolDistance += Math.abs(this.body.deltaX());
    const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer, {
      precision: 1, steepnes: 0.2});
    if ((!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) &&
    this.timeFromLastTurn + 100 < time) {
      this.setFlipX(!this.flipX);
      this.setVelocityX(this.speed = -this.speed);
      this.timeFromLastTurn = time;
      this.currentPatrolDistance = 0;
    }

    if (this.config.debug && ray) {
      this.rayGraphics.clear();
      this.rayGraphics.strokeLineShape(ray);
    }
  }

  setPlatformColliders(platformCollidersLayer) {
    this.platformCollidersLayer = platformCollidersLayer;
  }

  takesHit(source) {
    source.deliversHit(this);
    this.health -= source.damage;

    source.setActive(false);
    source.setVisible(false);

    if (this.health <= 0) {
     this.setTint(0xff0000);
      this.setVelocity(0, -200);
      this.body.checkCollision.none = true;
      this.setCollideWorldBounds(false);
    }
  }
}


export default Enemy;
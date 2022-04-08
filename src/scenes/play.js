
import Phaser from 'phaser';
import Player from '../entities/Player';

class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start);

    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: layers.platformsColliders
      }
    });

    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);
  }

  createMap() {
    //map is preloaded
    //now we need to create it, so we call it by the key we provided and also the tiles used for the creation of the map
    const map = this.make.tilemap({key: 'map'});

    //name should be SAME AS IN THE TILED SOFTWARE  
    map.addTilesetImage('main_lev_build_1', 'tiles-1');
    return map;
  }

  createLayers(map) {
    //tileset name and layer name should be SAME AS IN THE TILED SOFTWARE  
    const tileset = map.getTileset('main_lev_build_1');
    const platformsColliders = map.createStaticLayer('platforms_colliders', tileset);
    const environment = map.createStaticLayer('environment', tileset);
    const platforms = map.createDynamicLayer('platforms', tileset);
    const playerZones = map.getObjectLayer('player_zones');
    

    //METHOD-1
    //making the platrom as a collider 
    //true= set it as a colider
    // -1 = anything more than 0 is a collider object(see in the tilled JSON)
    //platforms.setCollisionByExclusion(-1,true);


    // M-2
    // make a layer and make a custom property
    
    platformsColliders.setCollisionByProperty({collides:true});

    return { environment, platforms,platformsColliders, playerZones };
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createPlayerColliders(player, { colliders }) {
    player
      .addCollider(colliders.platformsColliders)
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find(zone => zone.name === 'startZone'),
      end: playerZones.find(zone => zone.name === 'endZone')
    }
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add.sprite(end.x, end.y, 'end')
      .setAlpha(0)
      .setSize(5, this.config.height)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;
      console.log('Payer has won!');
    })
  }
}

export default Play;
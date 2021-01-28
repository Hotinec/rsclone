import Phaser from 'phaser';

interface IPointer {
  worldX: number;
  worldY: number;
}

export class DarkMode {
  // eslint-disable-next-line class-methods-use-this
  darking(
    scene: Phaser.Scene,
    layer1: Phaser.Tilemaps.TilemapLayer,
    layer2: Phaser.Tilemaps.TilemapLayer,
  ): void {
    layer1.setPipeline('Light2D');
    layer2.setPipeline('Light2D');
    scene.lights.enable().setAmbientColor(0x111111);
    const spotlight = scene.lights.addLight(400, 300, 128).setIntensity(3);
    scene.lights.addLight(400, 300, 128).setIntensity(3);
    scene.input.on('pointermove', (pointer: IPointer) => {
      spotlight.x = pointer.worldX;
      spotlight.y = pointer.worldY;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setDarkObject(object: Phaser.Physics.Arcade.Sprite | Phaser.Physics.Arcade.Image): void {
    object.setPipeline('Light2D');
  }
}

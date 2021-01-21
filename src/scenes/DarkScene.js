export class DarkScene {
  // eslint-disable-next-line class-methods-use-this
  darking(scene, layer1, layer2) {
    layer1.setPipeline('Light2D');
    layer2.setPipeline('Light2D');
    scene.lights.enable().setAmbientColor(0x111111);
    const spotlight = scene.lights.addLight(400, 300, 128).setIntensity(3);
    const playerlight = scene.lights.addLight(400, 300, 128).setIntensity(3);
    scene.input.on('pointermove', (pointer) => {
      spotlight.x = pointer.worldX;
      spotlight.y = pointer.worldY;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  darkZombie(zombie) {
    zombie.setPipeline('Light2D');
  }
}

function NewGameState() {
  let state = 'white';
  return function (setNewState) {
    if (setNewState) state = setNewState;
    return state;
  };
}

export const gameState = NewGameState();

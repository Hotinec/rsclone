interface IPlayerProperties {
  hp: number,
  scale: number,
  circle: number,
  speed: number,
  defaultTexture: string,
  defaultFrame: string
}

export const playerProperties:IPlayerProperties = {
  hp: 10,
  scale: 0.4,
  circle: 70,
  speed: 250,
  defaultTexture: 'knife',
  defaultFrame: 'survivor-idle_knife_0',
};

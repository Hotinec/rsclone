interface IWeaponProperties {
  [key: string]: {
    body: string,
    frame: string,
    magazine?: number,
  };
}

export const weaponProperties: IWeaponProperties = {
  knife: {
    body: 'knife',
    frame: 'survivor-idle_knife_0',
  },
  handgun: {
    body: 'handgun-body',
    frame: 'survivor-idle_handgun_0',
    magazine: 10,
  },
  shotgun: {
    body: 'shotgun-body',
    frame: 'survivor-idle_shotgun_0',
    magazine: 6,
  },
  rifle: {
    body: 'rifle-body',
    frame: 'survivor-idle_rifle_0',
    magazine: 30,
  },
};

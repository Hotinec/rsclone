interface IWeaponProperties {
  [key: string]: {
    body: string,
    frame: string,
    magazine?: number,
    endFrame?: string[]
  };
}

export const weaponProperties: IWeaponProperties = {
  knife: {
    body: 'knife',
    frame: 'survivor-idle_knife_0',
    endFrame: ['survivor-meleeattack_knife_12', 'survivor-meleeattack_knife_13', 'survivor-meleeattack_knife_14'],
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

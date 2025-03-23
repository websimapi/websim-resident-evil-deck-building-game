export const characterCardTemplates = [
  {
    name: "Chris Redfield",
    type: "Character",
    rarity: "Rare",
    set: "Premier Edition",
    health: 80,
    damage: 10,
    cost: 0,
    description: "S.T.A.R.S. member and founding member of the BSAA. Chris specializes in direct combat and has high endurance.",
    imageUrl: ""
  },
  {
    name: "Jill Valentine",
    type: "Character",
    rarity: "Rare",
    set: "Premier Edition",
    health: 70,
    damage: 8,
    cost: 0,
    description: "Former S.T.A.R.S. member known for her lockpicking skills and resourcefulness in combat situations.",
    imageUrl: ""
  },
  {
    name: "Leon S. Kennedy",
    type: "Character",
    rarity: "Rare",
    set: "Premier Edition",
    health: 75,
    damage: 9,
    cost: 0,
    description: "Rookie police officer turned government agent with exceptional survival skills and marksmanship.",
    imageUrl: ""
  }
];

export const weaponCardTemplates = [
  {
    name: "Handgun",
    type: "Weapon",
    rarity: "Common",
    set: "Premier Edition",
    damage: 5,
    cost: 10,
    ammo: 10,
    description: "Standard issue sidearm. Reliable but low damage output.",
    imageUrl: ""
  },
  {
    name: "Shotgun",
    type: "Weapon",
    rarity: "Uncommon",
    set: "Premier Edition",
    damage: 12,
    cost: 25,
    ammo: 5,
    description: "Powerful short-range weapon effective against groups of enemies.",
    imageUrl: ""
  },
  {
    name: "Magnum",
    type: "Weapon",
    rarity: "Rare",
    set: "Premier Edition",
    damage: 15,
    cost: 35,
    ammo: 6,
    description: "High-powered handgun capable of eliminating most threats with a single shot.",
    imageUrl: ""
  }
];

export const infectedCardTemplates = [
  {
    name: "Zombie",
    type: "Infected",
    rarity: "Common",
    set: "Premier Edition",
    health: 20,
    damage: 5,
    cost: 0,
    description: "Standard infected human. Slow-moving but dangerous in groups.",
    imageUrl: ""
  },
  {
    name: "Licker",
    type: "Infected",
    rarity: "Uncommon",
    set: "Premier Edition",
    health: 35,
    damage: 10,
    cost: 0,
    description: "Agile creature with exposed brain and deadly claws. Can climb walls and detect by sound.",
    imageUrl: ""
  },
  {
    name: "Tyrant",
    type: "Infected",
    rarity: "Ultra Rare",
    set: "Premier Edition",
    health: 100,
    damage: 15,
    cost: 0,
    description: "Powerful bioweapon created by Umbrella. Nearly unstoppable with immense strength and regenerative abilities.",
    imageUrl: ""
  }
];

export const itemCardTemplates = [
  {
    name: "Green Herb",
    type: "Item",
    rarity: "Common",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 5,
    description: "Medicinal herb that restores a small amount of health.",
    imageUrl: ""
  },
  {
    name: "First Aid Spray",
    type: "Item",
    rarity: "Uncommon",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 15,
    description: "Medical spray that fully restores health.",
    imageUrl: ""
  },
  {
    name: "Lockpick",
    type: "Item",
    rarity: "Uncommon",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 10,
    description: "Tool used to unlock simple doors and containers.",
    imageUrl: ""
  }
];

export const actionCardTemplates = [
  {
    name: "Quick Reload",
    type: "Action",
    rarity: "Common",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 8,
    description: "Reload your equipped weapon without using an action point.",
    imageUrl: ""
  },
  {
    name: "Tactical Retreat",
    type: "Action",
    rarity: "Common",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 6,
    description: "Avoid damage from one enemy attack.",
    imageUrl: ""
  },
  {
    name: "Critical Hit",
    type: "Action",
    rarity: "Uncommon",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 12,
    description: "Double the damage of your next attack.",
    imageUrl: ""
  }
];

export const ammoCardTemplates = [
  {
    name: "Handgun Ammo",
    type: "Ammo",
    rarity: "Common",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 5,
    ammo: 10,
    description: "Standard ammunition for handguns. The most common ammo type.",
    imageUrl: ""
  },
  {
    name: "Shotgun Shells",
    type: "Ammo",
    rarity: "Common",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 8,
    ammo: 5,
    description: "Ammunition for shotguns. Effective for close-range combat.",
    imageUrl: ""
  },
  {
    name: "Magnum Rounds",
    type: "Ammo",
    rarity: "Uncommon",
    set: "Premier Edition",
    health: 0,
    damage: 0,
    cost: 12,
    ammo: 6,
    description: "High-powered ammunition for magnum handguns. Rare and powerful.",
    imageUrl: ""
  }
];

export const getAllCardTemplates = () => {
  return [
    ...characterCardTemplates,
    ...weaponCardTemplates,
    ...infectedCardTemplates,
    ...itemCardTemplates,
    ...actionCardTemplates,
    ...ammoCardTemplates
  ];
};


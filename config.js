export const config = {
  // Card types
  cardTypes: [
    "Character",
    "Infected",
    "Weapon",
    "Item",
    "Action",
    "Ammo"
  ],
  
  // Card rarities
  rarities: [
    "Common",
    "Uncommon",
    "Rare",
    "Ultra Rare"
  ],
  
  // Card sets
  sets: [
    "Premier Edition",
    "Alliance",
    "Outbreak",
    "Nightmare",
    "Mercenaries",
    "Custom"
  ],
  
  // Weapon types
  weaponTypes: [
    "Handgun",
    "Shotgun",
    "Magnum",
    "Machine Gun",
    "Rifle",
    "Knife",
    "Grenade",
    "Special"
  ],
  
  // Maximum stats values
  maxStats: {
    damage: 20,
    health: 100,
    cost: 50,
    ammo: 50
  },
  
  // AI prompt templates for generating card descriptions
  descriptionPrompts: {
    Character: "Create a brief character description for {name} from Resident Evil. Focus on their background, skills, and role in the series.",
    Infected: "Create a description for the {name} enemy from Resident Evil. Describe its appearance, behavior, and threat level.",
    Weapon: "Create a description for the {name} weapon from Resident Evil. Include its effectiveness, ammo type, and any special features.",
    Item: "Create a description for the {name} item from Resident Evil. Explain its use, effect, and importance in the game.",
    Action: "Create a description for a {name} action card for a Resident Evil card game. Explain what this action does and its strategic value.",
    Ammo: "Create a description for {name} ammo from Resident Evil. Explain what weapons it can be used with and its effectiveness."
  },
  
  // AI prompt templates for generating card images
  imagePrompts: {
    Character: "A detailed portrait of {name} from Resident Evil, video game character, professional photography, dark background, ominous lighting",
    Infected: "A terrifying {name} monster from Resident Evil, zombie, creature, horror, dark atmosphere, video game style",
    Weapon: "A detailed {name} weapon from Resident Evil, realistic rendering, dark background, video game item",
    Item: "A {name} survival item from Resident Evil, video game object, dark background, realistic rendering",
    Action: "A dramatic scene depicting {name} action in Resident Evil style, tense moment, horror atmosphere",
    Ammo: "Box of {name} ammunition from Resident Evil, video game item, dark background, realistic rendering"
  }
};


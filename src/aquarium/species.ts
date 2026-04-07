export type FishShape = 'tetra' | 'ray' | 'angler' | 'jelly' | 'custom' | 'swarm' | 'flat' | 'squid';

export interface Trait {
  name: string;
  value: string;
}

export interface SpeciesData {
  name: string;
  scientificName: string;
  variant: string;
  depth: [number, number];
  size: number;
  type: FishShape;
  lum: number;
  agg: number;
  desc: string;
  habitat: string;
  ecology: string;
  traits: Trait[];
  location: string;
  baseSpeed: number;
  color: string;
  imageUrl?: string;
}

export const SPECIES: SpeciesData[] = [
  {
    name: 'Neon Tetra',
    scientificName: 'Paracheirodon innesi',
    variant: 'Abstract Variant',
    depth: [0.0, 0.2],
    size: 12,
    type: 'tetra',
    lum: 88,
    agg: 12,
    desc: 'A small, schooling characin found in the blackwater and clearwater streams.',
    habitat: 'Blackwater and clearwater streams',
    ecology: 'An omnivorous mid-water feeder, preying on small crustaceans and worms.',
    traits: [
      { name: 'Lifespan', value: '5-10 years' },
      { name: 'Diet', value: 'Omnivore' }
    ],
    location: 'Amazon basin (South America)',
    baseSpeed: 2,
    color: 'rgba(0, 212, 255, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1544552866-d3ed42536fcb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Manta Ray',
    scientificName: 'Mobula birostris',
    variant: 'Ethereal Variant',
    depth: [0.1, 0.5],
    size: 25,
    type: 'ray',
    lum: 40,
    agg: 5,
    desc: 'Glides silently through the mid-depths. Its movement is driven by simplex noise and gentle steering behaviors.',
    habitat: 'Tropical and subtropical oceans, open sea',
    ecology: 'A giant filter feeder that consumes large quantities of zooplankton.',
    traits: [
      { name: 'Max Weight', value: '3,000 kg' },
      { name: 'Wingspan', value: 'Up to 9m' }
    ],
    location: 'Worldwide in tropical waters',
    baseSpeed: 1.2,
    color: 'rgba(255, 255, 255, 0.5)',
    imageUrl: 'https://images.unsplash.com/photo-1582292671565-d01cc0332f14?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Humpback Anglerfish',
    scientificName: 'Melanocetus johnsonii',
    variant: 'Deep Variant',
    depth: [0.6, 0.95],
    size: 20,
    type: 'angler',
    lum: 95,
    agg: 80,
    desc: 'Lurks in the dark, using bioluminescence to attract prey.',
    habitat: 'Bathypelagic zone, deep sea',
    ecology: 'Uses a bioluminescent lure (esca) filled with symbiotic bacteria to attract unsuspecting prey in pitch-black waters.',
    traits: [
      { name: 'Max Length', value: '15 cm' },
      { name: 'Bioluminescence', value: 'Symbiotic bacteria' }
    ],
    location: 'Worldwide in temperate and tropical oceans',
    baseSpeed: 0.8,
    color: 'rgba(10, 200, 150, 0.6)',
    imageUrl: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ocean Sunfish',
    scientificName: 'Mola mola',
    variant: 'Pelagic Variant',
    depth: [0.0, 0.3],
    size: 35,
    type: 'flat',
    lum: 10,
    agg: 2,
    desc: 'A massive, slow-moving entity that drifts near the surface to absorb warmth.',
    habitat: 'Epipelagic and Mesopelagic zones',
    ecology: 'Preys primarily on large amounts of gelatinous zooplankton (jellyfish) and uses surface basking for thermal regulation.',
    traits: [
      { name: 'Max Weight', value: '2,300 kg' },
      { name: 'Diet', value: 'Jellyfish specialist' }
    ],
    location: 'Temperate and tropical oceans worldwide',
    baseSpeed: 0.5,
    color: 'rgba(200, 220, 255, 0.7)',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Moon Jellyfish',
    scientificName: 'Aurelia aurita',
    variant: 'Pulsing Variant',
    depth: [0.2, 0.7],
    size: 18,
    type: 'jelly',
    lum: 60,
    agg: 0,
    desc: 'Drifts vertically with a rhythmic pulsing motion, relying on ambient currents.',
    habitat: 'Coastal waters and epipelagic zones',
    ecology: 'Uses its translucent bell to pulsate and catch small zooplankton with fine tentacles.',
    traits: [
      { name: 'Water Content', value: '95%' },
      { name: 'Toxicity', value: 'Mild' }
    ],
    location: 'Worldwide',
    baseSpeed: 0.6,
    color: 'rgba(255, 150, 200, 0.6)',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Sloane\'s Viperfish',
    scientificName: 'Chauliodus sloani',
    variant: 'Angular Variant',
    depth: [0.5, 0.9],
    size: 15,
    type: 'tetra',
    lum: 30,
    agg: 90,
    desc: 'Moves in sharp, sudden darts. Adapted to the high pressure and low light of the deep ocean.',
    habitat: 'Mesopelagic and Bathypelagic zones',
    ecology: 'A fierce deep-sea predator with massive hinged fangs used to cage and impale its prey.',
    traits: [
      { name: 'Fang Size', value: 'Half head length' },
      { name: 'Jaw Ability', value: 'Unhinges to swallow' }
    ],
    location: 'Worldwide in deep tropical and temperate waters',
    baseSpeed: 2.5,
    color: 'rgba(200, 50, 50, 0.7)',
    imageUrl: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Atlantic Herring',
    scientificName: 'Clupea harengus',
    variant: 'Schooling Variant',
    depth: [0.05, 0.4],
    size: 5,
    type: 'swarm',
    lum: 70,
    agg: 5,
    desc: 'Moves collectively in tight formations, creating shimmering patterns in the upper layers.',
    habitat: 'Coastal to open pelagic ocean',
    ecology: 'A crucial forage fish that forms massive schools to evade predation while feeding on copepods.',
    traits: [
      { name: 'School Size', value: 'Up to 4 billion' },
      { name: 'Diet', value: 'Planktivore' }
    ],
    location: 'North Atlantic Ocean',
    baseSpeed: 2.2,
    color: 'rgba(220, 240, 255, 0.9)',
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Hadal Snailfish',
    scientificName: 'Pseudoliparis swirei',
    variant: 'Micro Variant',
    depth: [0.8, 1.0],
    size: 3,
    type: 'tetra',
    lum: 100,
    agg: 1,
    desc: 'Tiny, bioluminescent specks that inhabit the deepest trenches.',
    habitat: 'Hadal zone, ocean trenches',
    ecology: 'The deepest living known vertebrate. It feeds on small crustaceans living in deep sea trenches under crushing pressure.',
    traits: [
      { name: 'Max Depth', value: '8,000 meters' },
      { name: 'Bone Structure', value: 'Cartilage-like' }
    ],
    location: 'Mariana Trench (Pacific Ocean)',
    baseSpeed: 0.3,
    color: 'rgba(150, 255, 255, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80f04c0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Vampire Squid',
    scientificName: 'Vampyroteuthis infernalis',
    variant: 'Cephalopod Variant',
    depth: [0.4, 0.8],
    size: 22,
    type: 'squid',
    lum: 50,
    agg: 40,
    desc: 'Moves via sudden jet propulsion followed by a slow glide. Inhabits the oxygen minimum zone.',
    habitat: 'Mesopelagic zone, oxygen minimum zone',
    ecology: 'A detritivore that collects falling \"marine snow\" rather than actively hunting live prey.',
    traits: [
      { name: 'Defense', value: 'Pineapple posture' },
      { name: 'Diet', value: 'Marine snow' }
    ],
    location: 'Worldwide deep oceans',
    baseSpeed: 3.0,
    color: 'rgba(255, 80, 80, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Yellowfin Tuna',
    scientificName: 'Thunnus albacares',
    variant: 'Pelagic Predator',
    depth: [0.0, 0.2],
    size: 28,
    type: 'squid',
    lum: 0,
    agg: 60,
    desc: 'Fast oceanic predator that travels in large schools.',
    habitat: 'Epipelagic zone, open ocean',
    ecology: 'Highly migratory apex predator feeding on smaller fish, crustaceans, and squids.',
    traits: [
      { name: 'Max Speed', value: '75 km/h' },
      { name: 'Warm-blooded', value: 'Partial' }
    ],
    location: 'Tropical and subtropical oceans worldwide',
    baseSpeed: 5.0,
    color: 'rgba(255, 215, 0, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1596489370607-bf3648ed9de2?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Great White Shark',
    scientificName: 'Carcharodon carcharias',
    variant: 'Apex Variant',
    depth: [0.0, 0.3],
    size: 50,
    type: 'tetra',
    lum: 0,
    agg: 95,
    desc: 'The ocean\'s most iconic apex predator, patrolling the coastal surface waters.',
    habitat: 'Coastal and offshore waters',
    ecology: 'Feeds primarily on marine mammals and large fish, balancing the oceanic food web.',
    traits: [
      { name: 'Bite Force', value: '18,000 N' },
      { name: 'Senses', value: 'Electroreception' }
    ],
    location: 'Global coastal and pelagic waters',
    baseSpeed: 4.0,
    color: 'rgba(150, 160, 170, 0.9)',
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Mahi-Mahi',
    scientificName: 'Coryphaena hippurus',
    variant: 'Surface Cruiser',
    depth: [0.0, 0.1],
    size: 20,
    type: 'tetra',
    lum: 10,
    agg: 40,
    desc: 'Vibrantly colored surface dweller known for rapid growth.',
    habitat: 'Near-surface open ocean',
    ecology: 'Hunts small forage fish and squid near floating seaweed (Sargassum).',
    traits: [
      { name: 'Color Change', value: 'Fades when resting' },
      { name: 'Lifespan', value: 'Up to 5 years' }
    ],
    location: 'Tropical and subtropical waters',
    baseSpeed: 3.5,
    color: 'rgba(50, 255, 100, 0.9)',
    imageUrl: 'https://images.unsplash.com/photo-1522069213506-c87cdbafe2df?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    variant: 'Reef Variant',
    depth: [0.0, 0.05],
    size: 8,
    type: 'tetra',
    lum: 5,
    agg: 30,
    desc: 'A brightly colored fish that forms symbiotic relationships with anemones.',
    habitat: 'Shallow coral reefs',
    ecology: 'Gains protection from predators by living safely within stinging sea anemones.',
    traits: [
      { name: 'Symbiosis', value: 'Sea Anemone' },
      { name: 'Sex Change', value: 'Protandrous hermaphrodites' }
    ],
    location: 'Indo-Pacific and Red Sea',
    baseSpeed: 1.5,
    color: 'rgba(255, 120, 0, 0.9)',
    imageUrl: 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Opah (Moonfish)',
    scientificName: 'Lampris guttatus',
    variant: 'Endothermic Variant',
    depth: [0.1, 0.5],
    size: 30,
    type: 'flat',
    lum: 0,
    agg: 10,
    desc: 'A large, colorful, circular fish that is fully warm-blooded.',
    habitat: 'Mesopelagic zone, open ocean',
    ecology: 'Uses warm blood to maintain high activity levels in deep, cold waters while hunting squid.',
    traits: [
      { name: 'Warm-blooded', value: 'Fully endothermic' },
      { name: 'Shape', value: 'Laterally compressed' }
    ],
    location: 'Worldwide deep pelagic waters',
    baseSpeed: 2.5,
    color: 'rgba(255, 100, 100, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Giant Oarfish',
    scientificName: 'Regalecus glesne',
    variant: 'Serpent Variant',
    depth: [0.2, 1.0],
    size: 60,
    type: 'tetra',
    lum: 20,
    agg: 5,
    desc: 'The longest bony fish alive, often mistaken for sea serpents.',
    habitat: 'Mesopelagic to Bathypelagic zones',
    ecology: 'Hangs vertically in the water column to filter feed on krill and small crustaceans.',
    traits: [
      { name: 'Max Length', value: 'Up to 8 meters' },
      { name: 'Orientation', value: 'Vertical swimming' }
    ],
    location: 'Global deep oceans',
    baseSpeed: 0.8,
    color: 'rgba(200, 200, 220, 0.6)',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80f04c0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Coelacanth',
    scientificName: 'Latimeria',
    variant: 'Fossil Variant',
    depth: [0.2, 0.7],
    size: 22,
    type: 'tetra',
    lum: 0,
    agg: 15,
    desc: 'An ancient lobe-finned fish once thought to have gone extinct with the dinosaurs.',
    habitat: 'Steep rocky shores and volcanic caves',
    ecology: 'A slow-moving drift-hunter that uses electrosorption to find prey in the dark.',
    traits: [
      { name: 'Age of Lineage', value: '400+ million years' },
      { name: 'Fins', value: 'Lobe-finned' }
    ],
    location: 'Indian Ocean (Comoros, Indonesia)',
    baseSpeed: 1.0,
    color: 'rgba(70, 80, 120, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Goblin Shark',
    scientificName: 'Mitsukurina owstoni',
    variant: 'Abyssal Predator',
    depth: [0.3, 0.9],
    size: 35,
    type: 'tetra',
    lum: 0,
    agg: 60,
    desc: 'A bizarre, pink-skinned deep sea shark with a protruding snout.',
    habitat: 'Mesopelagic and Bathypelagic zones',
    ecology: 'Uses highly extendable jaws to rapidly snap up teleost fish and squids in the deep dark.',
    traits: [
      { name: 'Jaws', value: 'Slingshot extension' },
      { name: 'Skin Color', value: 'Translucent pink' }
    ],
    location: 'Continental slopes worldwide',
    baseSpeed: 1.5,
    color: 'rgba(255, 180, 180, 0.7)',
    imageUrl: 'https://images.unsplash.com/photo-1544552866-d3ed42536fcb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Giant Squid',
    scientificName: 'Architeuthis dux',
    variant: 'Kraken Variant',
    depth: [0.3, 0.9],
    size: 55,
    type: 'squid',
    lum: 10,
    agg: 70,
    desc: 'A massive, elusive cephalopod that fights sperm whales in the deep ocean.',
    habitat: 'Bathypelagic zone',
    ecology: 'Hunts deep-sea fish and other squids. Its only known predators are sperm whales.',
    traits: [
      { name: 'Eye Size', value: 'Largest in animal kingdom' },
      { name: 'Max Weight', value: '275 kg' }
    ],
    location: 'Global deep oceans',
    baseSpeed: 3.5,
    color: 'rgba(200, 50, 80, 0.8)',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Dumbo Octopus',
    scientificName: 'Grimpoteuthis',
    variant: 'Benthic Variant',
    depth: [0.7, 1.0],
    size: 10,
    type: 'jelly',
    lum: 5,
    agg: 0,
    desc: 'A tiny, cute octopus that uses ear-like fins to hover above the sea floor.',
    habitat: 'Abyssopelagic and Hadal zones',
    ecology: 'Forages along the darkest ocean floors, swallowing worms and crustaceans whole.',
    traits: [
      { name: 'Fins', value: 'Ear-like flaps' },
      { name: 'Ink Sack', value: 'None (too dark)' }
    ],
    location: 'Worldwide deep sea floors',
    baseSpeed: 0.5,
    color: 'rgba(255, 200, 220, 0.7)',
    imageUrl: 'https://images.unsplash.com/photo-1544552866-d3ed42536fcb?auto=format&fit=crop&w=800&q=80'
  }
];

export const DEPTH_ZONES = [
  { 
    name: 'Surface', 
    range: [0, 0.05], 
    label: '0 - 50m', 
    tagline: 'Where light meets water',
    desc: 'The boundary between air and ocean, constantly in motion.', 
    fact: 'Most of the ocean\'s heat is absorbed in this thin top layer.',
    color: '#00D4FF' 
  },
  { 
    name: 'Epipelagic', 
    range: [0.05, 0.2], 
    label: '50 - 200m', 
    tagline: 'Where light creates life',
    desc: 'Sunlight enables photosynthesis and supports most ocean ecosystems.', 
    fact: 'Nearly all marine food chains begin here.',
    color: '#00A3FF' 
  },
  { 
    name: 'Upper Mesopelagic', 
    range: [0.2, 0.4], 
    label: '200 - 500m', 
    tagline: 'The twilight of constant migration',
    desc: 'Light fades, and organisms migrate vertically in massive daily cycles.', 
    fact: 'This is the largest migration on Earth.',
    color: '#0052D4' 
  },
  { 
    name: 'Lower Mesopelagic', 
    range: [0.4, 0.6], 
    label: '500 - 1000m', 
    tagline: 'Fading light and rising pressure',
    desc: 'The last remnants of sunlight disappear, giving way to bioluminescence.', 
    fact: 'Many creatures here have upward-looking eyes to spot silhouettes.',
    color: '#002B80' 
  },
  { 
    name: 'Bathypelagic', 
    range: [0.6, 0.8], 
    label: '1000 - 4000m', 
    tagline: 'Darkness becomes the default',
    desc: 'No sunlight exists. Life adapts through bioluminescence and slow metabolism.', 
    fact: 'Many creatures create their own light.',
    color: '#0A0A2E' 
  },
  { 
    name: 'Abyssopelagic', 
    range: [0.8, 0.95], 
    label: '4000 - 6000m', 
    tagline: 'Silence under crushing pressure',
    desc: 'Extreme pressure and near-freezing temperatures define survival.', 
    fact: 'Food mainly comes from "marine snow" above.',
    color: '#050515' 
  },
  { 
    name: 'Hadal Zone', 
    range: [0.95, 1.0], 
    label: '6000m+', 
    tagline: 'Where Earth almost ends',
    desc: 'Deep ocean trenches host some of the least explored life forms.', 
    fact: 'We know less about this zone than the moon.',
    color: '#000000' 
  }
];

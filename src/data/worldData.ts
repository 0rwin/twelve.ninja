export interface WorldTile {
    id: number;
    name: string;
    image: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
}

export const worldData: WorldTile[] = [
    {
        id: 1,
        name: "The Obsidian Crag",
        image: "/assets/world-tiles/tile_01.png",
        description: "A jagged wasteland of sharp rocks and dark minerals. Resources are rare, but valuable.",
        difficulty: "Hard"
    },
    {
        id: 2,
        name: "Duskfall Hamlet",
        image: "/assets/world-tiles/tile_02.png",
        description: "A quiet village perpetually shrouded in twilight. Excellent for trade and recruiting early followers.",
        difficulty: "Easy"
    },
    {
        id: 3,
        name: "Shadow-Crest Summit",
        image: "/assets/world-tiles/tile_03.png",
        description: "High-altitude peaks where the air is thin and ancient beasts roost. High risk, high reward.",
        difficulty: "Hard"
    },
    {
        id: 4,
        name: "Lantern’s Deep",
        image: "/assets/world-tiles/tile_04.png",
        description: "A subterranean settlement illuminated by glowing fungi and lanterns. Good for mining operations.",
        difficulty: "Medium"
    },
    {
        id: 5,
        name: "Iron-Fang Range",
        image: "/assets/world-tiles/tile_05.png",
        description: "Snow-capped mountains rich in iron ore, guarded by territorial clans.",
        difficulty: "Medium"
    },
    {
        id: 6,
        name: "Serpent’s Flow Valley",
        image: "/assets/world-tiles/tile_06.png",
        description: "A lush, winding river valley. The soil is fertile for farming, but the river hides predators.",
        difficulty: "Easy"
    },
    {
        id: 7,
        name: "The Silent Stalks",
        image: "/assets/world-tiles/tile_07.png",
        description: "A dense bamboo forest that confuses travelers. Home to stealthy units and wood resources.",
        difficulty: "Medium"
    },
    {
        id: 8,
        name: "Mist-Veiled Bridge",
        image: "/assets/world-tiles/tile_08.png",
        description: "A strategic choke point connecting two cliffs. Control this, and you control the trade routes.",
        difficulty: "Hard"
    },
    {
        id: 9,
        name: "Aether-Bound Citadel",
        image: "/assets/world-tiles/tile_09.png",
        description: "A floating fortress in the sky. Magic is potent here, but gravity is a constant threat.",
        difficulty: "Very Hard"
    },
    {
        id: 10,
        name: "The Calm Waters",
        image: "/assets/world-tiles/tile_10.png",
        description: "Peaceful lakes and fishing spots. A safe haven for beginners to build up resources.",
        difficulty: "Easy"
    }
];

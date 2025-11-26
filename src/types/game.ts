export interface Player {
  id: string;
  username: string;
  email?: string;
  primary_code?: string;
  level: number;
  xp: number;
  ryo: number;           // New!
  current_tile_id: string; // New!
  stamina: number;       // Changed from energy
  max_stamina: number;
  skill_points: number;
}
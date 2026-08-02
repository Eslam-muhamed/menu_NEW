export type Temperature  = 'hot' | 'cold' | 'any';
export type Mood         = 'energize' | 'relax' | 'refresh' | 'sweet' | 'any';
export type FlavorFamily = 'coffee' | 'herbs' | 'fruits' | 'milk' | 'any';
export type Sweetness    = 'light' | 'medium' | 'high' | 'any';

export type CoreMood    = Exclude<Mood, 'any'>;

export interface ItemMetadata {
  temperature:  'hot' | 'cold';
  moods:        CoreMood[];
  flavorFamily: Exclude<FlavorFamily, 'any'>;
  sweetness:    Exclude<Sweetness, 'any'>;
}

export interface UserAnswers {
  temperature:  Temperature;
  mood:         Mood;
  flavorFamily: FlavorFamily;
  sweetness:    Sweetness;
}
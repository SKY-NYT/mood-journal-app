export enum Mood {
  HAPPY = "HAPPY",
  SAD = "SAD",
  MOTIVATED = "MOTIVATED",
  STRESSED = "STRESSED",
  CALM = "CALM"
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  timestamp: number;
}
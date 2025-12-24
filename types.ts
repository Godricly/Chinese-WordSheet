
export interface CharacterInfo {
  char: string;
  pinyin: string;
  meaning: string;
}

export type GridType = 'tian' | 'mi' | 'none';

export interface WorksheetConfig {
  characters: string[];
  gridType: GridType;
  showPinyin: boolean;
  showMeaning: boolean;
  showTracing: boolean;
  showStrokeOrder: boolean;
  gridCount: number;
  gridColor: string;
  fontSize: number;
  title: string;
  fontFamily: string;
  useFontForReference: boolean;
}

export interface GeminiCharData {
  char: string;
  pinyin: string;
  meaning: string;
}

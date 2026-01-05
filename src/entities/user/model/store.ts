// [FACTS]: Adding Zakat domain model to the user entity
export interface ZakatAssets {
  cash: number;
  gold: number;
  silver: number;
  investments: number;
  businessAssets: number;
}

export interface InheritanceData {
  totalWealth: number;
  heirs: string[];
  distribution?: Array<{ heir: string; share: string }>;
}

export interface DhikrSession {
  user_id: string;
  count: number;
  last_updated: string;
  phrase: string;
}
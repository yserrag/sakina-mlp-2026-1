import { ZakatAssets } from '@/entities/user/model/store'; // [FACTS]: Verified @ alias

export class ZakatEngine {
  private static NISAB_THRESHOLD = 5000; // [ANALYSIS]: Static MLP value for Gold Nisab

  /**
   * Calculates total zakat liability
   * [FACTS]: Standard 2.5% calculation on applicable assets
   */
  static calculate(assets: ZakatAssets): { total: number; isEligible: boolean; due: number } {
    const total = Object.values(assets).reduce((acc, val) => acc + val, 0);
    const isEligible = total >= this.NISAB_THRESHOLD;
    const due = isEligible ? total * 0.025 : 0;

    return { total, isEligible, due };
  }
}
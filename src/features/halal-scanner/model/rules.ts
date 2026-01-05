export interface IngredientRule {
    status: 'Halal' | 'Haram' | 'Mushbooh';
    reason: string;
    link: string;
  }
  
  export const HMC_RULES: Record<string, IngredientRule> = {
    'e120': {
      status: 'Haram',
      reason: 'Carmine (Cochineal) - Derived from insects, prohibited under HMC standards.',
      link: 'https://halalhmc.org/resources/hmc-halal-standards/'
    },
    'shellac': {
      status: 'Mushbooh',
      reason: 'Derived from insect secretions. Scholarly opinions differ on its purity.',
      link: 'https://halalhmc.org/resources/is-shellac-halal/'
    },
    'e471': {
      status: 'Mushbooh',
      reason: 'Mono- and diglycerides. Can be animal or plant-derived.',
      link: 'https://halalhmc.org/resources/common-halal-concerns/'
    }
  };
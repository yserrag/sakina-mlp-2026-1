import { AppMode } from './types';

export const APP_MODES = [
  { 
    id: AppMode.EVERYDAY, 
    label: 'Everyday', 
    icon: 'Mosque',
    desc: 'Utility focused'
  },
  { 
    id: AppMode.REVERT, 
    label: 'Revert', 
    icon: 'BookOpen',
    desc: 'Guided path'
  },
  { 
    id: AppMode.KIDS, 
    label: 'DeenQuest', 
    icon: 'Star',
    desc: 'Gamified learning'
  }
];

export const MOCK_REVERT_STEPS = [
  { id: 1, title: 'Wudu (Ablution)', desc: 'Cleanliness before prayer', completed: true },
  { id: 2, title: 'The Adhan', desc: 'Call to prayer meaning', completed: false },
  { id: 3, title: 'Surah Al-Fatiha', desc: 'The Opening', completed: false },
];

export const MOCK_KIDS_TASKS = [
  { id: '1', title: 'Pray Dhuhr', points: 50, completed: false },
  { id: '2', title: 'Say Bismillah', points: 10, completed: true },
  { id: '3', title: 'Smile at someone', points: 20, completed: false },
];
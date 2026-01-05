import { useState } from 'react';

export interface Milestone {
  id: string;
  title: string;
  desc: string;
  completed: boolean;
  locked: boolean;
}

export const useRevertJourney = () => {
  // [STRATEGY]: Gamified Spiritual Progression
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'm1',
      title: 'The Declaration',
      desc: 'Taking your Shahada and understanding its pillar.',
      completed: true, 
      locked: false
    },
    {
      id: 'm2',
      title: 'The First Connection',
      desc: 'Learning Al-Fatiha and the movements of Salah.',
      completed: false,
      locked: false
    },
    {
      id: 'm3',
      title: 'The Purified State',
      desc: 'Mastering Ghusl and Wudu (Ritual Purity).',
      completed: false,
      locked: true 
    },
    {
      id: 'm4',
      title: 'The Community',
      desc: 'Attending your first Jummah at a local mosque.',
      completed: false,
      locked: true
    }
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      // Logic: Only unlock/toggle if not locked
      if (m.id === id && !m.locked) {
        return { ...m, completed: !m.completed };
      }
      return m;
    }));
  };

  return { milestones, toggleMilestone };
};
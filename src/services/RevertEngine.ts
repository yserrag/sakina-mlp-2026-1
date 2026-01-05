import { CurriculumState, Module } from '@/entities/revert-path/model/curriculum'; // [FACTS]: Verified @ alias path

export class RevertEngine {
  private static initialModules: Module[] = [
    { id: '1', title: 'The Basics of Salah', description: 'Learning the physical movements of prayer.', status: 'available', order: 1 },
    { id: '2', title: 'Understanding Wudu', description: 'The spiritual and physical purification.', status: 'locked', order: 2 },
    { id: '3', title: 'Five Pillars', description: 'The foundation of a Muslims life.', status: 'locked', order: 3 },
  ];

  /**
   * getProgress
   * [ANALYSIS]: Calculates progress based on completed modules for the high-fidelity progress bar.
   */
  static getProgress(modules: Module[]): number {
    const completed = modules.filter(m => m.status === 'completed').length;
    return Math.round((completed / modules.length) * 100);
  }

  static getInitialState(): CurriculumState {
    return {
      currentModuleId: '1',
      modules: this.initialModules,
      totalProgress: 0
    };
  }
}
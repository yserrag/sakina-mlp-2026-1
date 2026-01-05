// [FACTS]: Domain model for learning modules
export interface Module {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  order: number;
}

export interface CurriculumState {
  currentModuleId: string;
  modules: Module[];
  totalProgress: number; // 0 to 100
}
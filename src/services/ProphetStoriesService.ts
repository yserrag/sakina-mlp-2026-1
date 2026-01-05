import { ProphetStory } from '@/entities/daily-wisdom/model/types'; // [FACTS]: Verified @ alias

export class ProphetStoriesService {
  private static stories: ProphetStory[] = [
    {
      id: 'p1',
      prophet: 'Adam (AS)',
      title: 'The First Man',
      summary: 'The story of creation and the beginning of humanity.',
      videoUrl: 'https://example.com/v1',
      thumbnail: 'https://images.unsplash.com/photo-1505673539012-e405c4ee0fd1',
      duration: '5:30',
      lesson: 'The importance of seeking forgiveness.'
    },
    {
      id: 'p2',
      prophet: 'Nuh (AS)',
      title: 'The Great Ark',
      summary: 'Building the ark and the power of faith.',
      videoUrl: 'https://example.com/v2',
      thumbnail: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02',
      duration: '7:45',
      lesson: 'Patience and trust in Allah.'
    }
  ];

  /**
   * getAllStories
   * [ANALYSIS]: In the MLP phase, this returns the static collection for high-fidelity preview.
   */
  static getAllStories(): ProphetStory[] {
    return this.stories;
  }
}
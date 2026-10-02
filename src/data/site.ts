export const github = 'https://github.com/j-pollack';

export const projects: {
  id: string;
  title: string;
  description: string;
  category: string;
  demo?: string;
  source?: string;
}[] = [
  {
    id: 'plant-the-flag',
    title: 'Plant the flag',
    description: 'Prompt an agent to evade an AI monitor and make a disallowed network call to a harmless test endpoint. A planned experiment in AI control, with parallels to auditing frontier labs.',
    category: 'AI control / planned experiment',
    // Add demo and source URLs when the experiment is live.
  },
];

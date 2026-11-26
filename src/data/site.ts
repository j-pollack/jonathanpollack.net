export const github = 'https://github.com/j-pollack';
export const contactEmail = 'contact@jonathanpollack.net';

export const greeting = 'Hi, I’m Jonathan';

export const pages = {
  '/': {
    title: 'Jonathan Pollack',
    description: 'Writings and interactive experiments.',
  },
  '/writing/': {
    title: 'Writing — Jonathan Pollack',
    description: 'Essays on AI, experimental results, and other fun stuff.',
  },
  '/projects/': {
    title: 'Projects — Jonathan Pollack',
    description: 'Experiments, tools, and ideas made tangible.',
  },
};

export const shareImagePath = (pathname: string) => `/share/${pathname.replace(/^\/|\/$/g, '') || 'home'}.png`;

export const projects: {
  id: string;
  title: string;
  description: string;
  category: string;
  demo?: string;
  source?: string;
}[] = [
  {
    id: 'capture-the-flag',
    title: 'Capture the flag',
    description: 'Prompt an agent to evade an AI monitor and steal the contents of flag.txt.',
    category: 'AI control / experiment',
    demo: 'https://ctf.jonathanpollack.net',
  },
];

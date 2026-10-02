import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

if (!process.env.CI && existsSync('.git')) {
  execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], { stdio: 'inherit' });
}

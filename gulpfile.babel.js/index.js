import { execSync } from 'child_process';

const clean = async () => {
  const stdout = execSync('rm -rf dist/*');
  console.log(`stdout: ${stdout}`);
};

exports.clean = clean;

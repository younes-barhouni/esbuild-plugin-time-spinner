import ora from 'ora';
import chalk from 'chalk';
import { BuildOptions, BuildResult, Plugin, PluginBuild } from 'esbuild';

interface IOptions {
  name?: string;
  message?: string;
}

export default (options: IOptions = {}): Plugin => {
  const name = options.name || 'App';
  const message = options.message || 'Building started';
  const spinner = ora();

  return {
    name: 'progress',
    setup(build: PluginBuild) {
      let time: number;
      build.onStart(() => {
        console.log(`Build started for ${chalk.green(name)}`);
        spinner.text = `${message}\n`;
        spinner.start();
        time = new Date() as unknown as number;
      });
      build.onEnd((result: BuildResult<BuildOptions>) => {
        result.errors.length ? spinner.fail(`Build failed. ${result.errors.length} error${result.errors.length > 1 ? 's' : ''}`) : spinner.succeed('Build successful');
        console.log(`Build ended ${chalk.green(name)}: ${chalk.yellow(` ⏱️ ${(new Date() as unknown as number) - time}ms`)}`);
      });
    },
  };
};
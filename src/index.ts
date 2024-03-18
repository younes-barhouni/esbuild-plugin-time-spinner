import ora, { Spinner } from 'ora';
import {type SpinnerName} from 'cli-spinners';
import chalk from 'chalk';
import { BuildOptions, BuildResult, Plugin, PluginBuild } from 'esbuild';

export interface IOptions {
  name?: string;
  message?: string;
  spinner?: SpinnerName | Spinner;
}

export default (options: IOptions = {}): Plugin => {
  const name: string = options.name || 'App';
  const message: string = options.message || 'Building started';
  const spinner: SpinnerName | Spinner = options.spinner || 'dots';
  const oraSpinner = ora();

  return {
    name: 'progress',
    setup(build: PluginBuild) {
      let time: number;
      build.onStart(() => {
        console.log(`Build started for ${chalk.green(name)}`);
        oraSpinner.text = `${message}\n`;
        oraSpinner.spinner = spinner;
        oraSpinner.start();
        time = new Date() as unknown as number;
      });
      build.onEnd((result: BuildResult<BuildOptions>) => {
        result.errors.length ? oraSpinner.fail(`Build failed. ${result.errors.length} error${result.errors.length > 1 ? 's' : ''}`) : oraSpinner.succeed('Build successful');
        console.log(`Build ended ${chalk.green(name)}: ${chalk.yellow(` ⏱️ ${(new Date() as unknown as number) - time}ms`)}`);
      });
    },
  };
};
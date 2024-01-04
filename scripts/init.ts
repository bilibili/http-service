import { globSync } from 'glob'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { resolve } from 'path'
import chalk from 'chalk'

const rootDir = 'packages/'

function build(pkg: string) {
  try {
    execSync(`pnpm run build`, { stdio: 'inherit', cwd: resolve(rootDir, pkg) })
    console.log(chalk.green(`构建成功: ${pkg}`))
  } catch (error) {
    console.log(chalk.red(`构建失败: ${pkg}`))
  }
}

async function main() {
  const { install } = await inquirer.prompt([
    {
      name: 'install',
      message: '是否执行安装依赖',
      type: 'confirm',
      default: false
    }
  ])
  if (install) {
    execSync('pnpm install', { stdio: 'inherit' })
  }
  const all = rootDir + '*'
  const requiredOrderList = ['middleware', 'http-svc']
  const ignore = ['template', ...requiredOrderList].map((pkg) => rootDir + pkg)
  const pkgs = [...requiredOrderList, ...(globSync(all, { ignore }).map((pkg) => pkg.replace(rootDir, '')))];

  while (pkgs.length) {
    const pkg = pkgs.shift()
    build(pkg as string)
  }
}

main()
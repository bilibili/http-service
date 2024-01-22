import fs from 'fs'
import inquirer from 'inquirer'
import { globSync } from 'glob'
import chalk from 'chalk'
import { execSync } from 'child_process'
import { copy } from './copy.util'

const pkgs = globSync('packages/*')
const templateFolderPath = 'template'

const getDependVersion = (pkg: string) => {
  const data = fs.readFileSync(`packages/${pkg}/package.json`, 'utf8');
  return `workspace:^${JSON.parse(data).version}`
}

const transformName = (name: string, type: 'camel' | 'Camel' | 'UPPER_SNAKE'): string => {
    return name.split('-').map((s, i) => {
        if (type === 'UPPER_SNAKE') {
            if (i === 0) return s.toLocaleUpperCase()
            return `_${s.toLocaleUpperCase()}`
        }

        if (type === 'camel' && i === 0) return s
        return s[0].toLocaleUpperCase() + s.substring(1)
    }).join('')
}

const modifyFile = (filePath: string, replaces: Array<string[]>) => {
  // 1. 读取文件内容
  const oFilePath = filePath + '.txt'
  const data = fs.readFileSync(oFilePath, 'utf8');

  // 2. 修改文件内容
  let modifiedData = data
  replaces.forEach(([o, n]) => {
    modifiedData = modifiedData.replace(new RegExp(`{{${o}}}`, 'g'), n)
  })
  // 3. 将修改后的内容写回文件
  fs.writeFileSync(filePath, modifiedData, 'utf8');
  fs.unlinkSync(oFilePath)
}

;(async () => {
    const { name } = await inquirer.prompt([
        {
            name: 'name',
            message: '请输入想创建的中间件名称(eg: do-sth)',
            validate: (input) => {
                if (pkgs.includes(`packages/${input}`)) return '此包名已被使用，请更换'
                return true
            }
        }
    ])
    if (name === "") return
    const { description } = await inquirer.prompt([
        {
            name: 'description',
            message: '请输入该中间件的描述',
        }
    ])
    await copy(`packages/${templateFolderPath}`, `packages/${name}`)
    modifyFile(`packages/${name}/package.json`, [
        ['name', name],
        ['description', description],
        ['http-svc', getDependVersion('http-svc')],
        ['@http-svc/middleware', getDependVersion('middleware')],
        ['@http-svc/types', getDependVersion('types')],
    ])
    modifyFile(`packages/${name}/index.ts`, [
        ['name', name],
        ['camelCaseName', transformName(name, 'camel')],
        ['CamelCaseName', transformName(name, 'Camel')],
        ['UPPER_SNAKE_CASE_NAME', transformName(name, 'UPPER_SNAKE')],
    ])
    console.log(chalk.green('创建' + name + '中间件成功!'))

    const {install} = await inquirer.prompt([
        {
            name: 'install',
            message: '是否立刻执行 pnpm install?',
            type: 'confirm',
            default: true,
        }
    ])
    if (install) {
        execSync('pnpm install', { cwd: `packages/${name}`, stdio: 'inherit' })
        console.log(chalk.green('依赖安装完成！'))
    }
})()


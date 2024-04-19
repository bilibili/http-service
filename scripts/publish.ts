/**
 * 在根目录运行子项目的脚本
 * 命令：pnpm start
 */
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { globSync } from 'glob'
import { execSync } from 'child_process'
import { nextTick } from 'process'

inquirer.registerPrompt('search-list', require('inquirer-search-list'))

const resolve = (...p) => path.resolve(process.cwd(), ...p)
const workspaces = ['packages']
const projectList = workspaces
  .reduce((projs: string[], proj: string) => projs.concat(globSync(resolve(proj, '*'))), [])
  .filter((proj) => fs.existsSync(path.join(proj, 'package.json')))
  .map((proj) => {
    const pkg = require(path.join(proj, 'package.json'))
    return {
        name: proj.replace(`${resolve()}/packages/`, ''),
        cwd: proj,
        pkgName: pkg.name,
        json: pkg,
    }
  })

 
async function main() {
    const questionProject = [
        {
          type: 'search-list',
          name: 'project',
          message: '请选择运行项目',
          choices: projectList.map((p) => p.name)
        }
    ]
    const { project } = await inquirer.prompt(questionProject)

    const { json, cwd, pkgName } = projectList.find(
        (proj) => proj.name === project
    ) as any
    const { scripts } = json
    if (scripts.test) {
        const { test } = await inquirer.prompt([
            {
              name: 'test',
              message: '发现test 指令，是否现在进行测试',
              type: 'confirm',
              default: true,
            },
        ])
        if (test) {
            console.log(chalk.green(`[${pkgName}] 开始测试`))
            await execSync(`pnpm run test`, { cwd, stdio: 'inherit' })
            console.log(chalk.green(`[${pkgName}] 测试通过`))
        }
    }

    const { build } = await inquirer.prompt([
        {
          name: 'build',
          message: '是否现在进行构建',
          type: 'confirm',
          default: false,
        },
    ])
    if (build) {
        if (!scripts.build) {
            return Promise.reject(new Error('没有build指令'))
        }
        console.log(chalk.green(`[${pkgName}] 开始构建`))
        await execSync(`pnpm run build`, { cwd, stdio: 'inherit' })
        console.log(chalk.green(`[${pkgName}] 构建完成`))
    }

    let version = json.version

    const { immediately } = await inquirer.prompt([
        {
          name: 'immediately',
          message: `当前版本号为: ${version}，是否发布？`,
          type: 'confirm',
          default: false,
        },
    ])

    if (!immediately) {
        const { newVersion } = await inquirer.prompt([
            {
                type: 'input',
                name: 'newVersion',
                message: '请输入版本号：',
                validate(input) {
                    if (input) {
                        return true;
                    } else {
                        return '请输入有效的版本号（例如：1.0.0）';
                    }
                },
            },
        ]);
        version = newVersion
    }

    const { confirm } = await inquirer.prompt([
        {
          name: 'confirm',
          message: `确认发布版本号为: ${version}`,
          type: 'confirm',
          default: true,
        },
    ])

    if (!confirm) {
        console.log(chalk.blue(`[${pkgName}] 退出发布`))
        return
    }

    try {
        const newJson = JSON.parse(JSON.stringify(json).replace(/workspace:/g, ''))
        newJson.version = version
        fs.writeFileSync(cwd + '/package.json', JSON.stringify(newJson, null, 2))
        await execSync(`npm publish`, { cwd, stdio: 'inherit' })
        const finalJson = JSON.parse(JSON.stringify(json))
        finalJson.version = version
        fs.writeFileSync(cwd + '/package.json', JSON.stringify(finalJson, null, 2))
        console.log(chalk.green(`${pkgName}@${version} publish`))
    } catch (error) {
        fs.writeFileSync(cwd + '/package.json', JSON.stringify(json, null, 2))
    }

}

main()
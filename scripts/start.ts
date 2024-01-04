/**
 * 在根目录运行子项目的脚本
 * 命令：pnpm start
 */
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { globSync } from 'glob'
import { execSync } from 'child_process'

inquirer.registerPrompt('search-list', require('inquirer-search-list'))

const resolve = (...p) => path.resolve(process.cwd(), ...p)
const workspaces = ['packages']
const projectList = workspaces
  .reduce((projs: string[], proj: string) => projs.concat(globSync(resolve(proj, '*'))), [])
  .filter((proj) => fs.existsSync(path.join(proj, 'package.json')))
  .map((proj) => {
    const pkg = require(path.join(proj, 'package.json'))
    const projName = pkg.name
    const projVersion = pkg.version
    const scripts = pkg.scripts ? Object.keys(pkg.scripts) : ''
    return {
      scripts,
      projName,
      projVersion,
      pkg: `${projName}${projVersion ? '@' + projVersion : ''}`,
      projPath: proj,
      depends: pkg.dependencies || {}
    }
  })

const getPkgChoices = (projName) => {
  return projectList.reduce((choices: any[], p) => {
    if (p.projName === projName) return choices
    const choice: any = {
      value: p.pkg
    }
    if (p.projName in p.depends) {
      choice.name = `${p.pkg}(覆盖安装)`
      choices.unshift(choice)
    } else {
      choices.push(choice)
    }
    return choices
  }, [])
}

const splitPkg = (pkg) => {
  let [group, pkgNameVersion] = pkg.split('/')
  if (!pkgNameVersion) {
    pkgNameVersion = group
    group = ''
  }

  const [pkgName, version] = pkgNameVersion.split('@')

  return [[group, pkgName].filter(Boolean).join('/'), version || '']
}

const getDependList = (pkgs) => {
  const allPkgsMap = {}
  pkgs.forEach(p => {
    const [ n, v ] = splitPkg(p)
    if (n) {
      allPkgsMap[n] = v
    }
  })
  return Object.keys(allPkgsMap).map(k => `${k}${allPkgsMap[k] ? '@' + allPkgsMap[k] : '' }`)
}

// 1.1.0-beta.1
const getVersionChoices = (version) => {
  const [officialV, tagV] = version.split('-')
  const [major, minor, patch] = officialV.split('.')

  const obj = {
    patch: `${+major}.${+minor}.${+patch + 1}`,
    minor: `${+major}.${+minor + 1}.0`,
    major: `${+major + 1}.0.0`,
  }

  const choices: any[] = Object.keys(obj).map(key => ({ name: `${key} (${obj[key]})`, value: obj[key]}))

  if (tagV) {
    const [t, v] = tagV.split('.')
    if (t && typeof v === 'number' && !isNaN(v)) {
      choices.push({
        name: `${t} (${officialV}-${t}.${v + 1})`,
      })
    }
  }

  choices.push({
    name: '手动指定版本',
    value: '',
  })

  return choices
}

const questionProject = [
  {
    type: 'search-list',
    name: 'project',
    message: '请选择运行项目',
    choices: projectList.map((p) => p.projName)
  }
]
inquirer.prompt(questionProject, {}).then(({ project }) => {
  const { projPath, scripts, projName, depends, projVersion } = projectList.find(
    (proj) => proj.projName === project
  ) as any

  const script = process.env.PROJECT_SCRIPT

  if (script) {
    // install depend
    if (script === 'install') {
      inquirer.prompt([
        {
          name: 'dev',
          message: '是否是Dev依赖',
          type: 'confirm',
          default: false,
        },
        {
          name: 'pkgChoices',
          message: '是否安装仓库内依赖',
          type: 'checkbox',
          choices: getPkgChoices(projName),
          when: answer => !answer.dev
        },
        {
          name: 'pkgsInput',
          message: '请输入需要安装的其他packages',
        }
      ], {}).then(({ pkgChoices, pkgsInput, dev }) => {
        execSync( `pnpm install ${getDependList([...(pkgChoices || []), ...pkgsInput.split(' ').filter(Boolean)])}${dev ? ' -D' : ''}`, { cwd: projPath, stdio: 'inherit' })
      })
      return
    }

    // pub
    if (script === 'pub') {
      inquirer.prompt([
        {
          message: '请选择版本',
          name: 'version',
          type: 'list',
          choices: getVersionChoices(projVersion)
        },
        {
          message: '请输入指定版本',
          name: 'versionInput',
          when: answer => !answer.version,
          default: projVersion
        },
        {
          message: '请输入版本tag',
          name: 'tag',
        },
      ], {}).then(({ version, versionInput, tag }) => {
        // write version at pkgjson
        const v = version || versionInput
        const oldPkgJsonData = fs.readFileSync(projPath + '/package.json', 'utf-8')
        const pkgJsonObj = require(projPath + '/package.json')
        pkgJsonObj.version = v
        fs.writeFileSync(projPath + '/package.json', JSON.stringify(pkgJsonObj, null, 2))
        inquirer.prompt([
          {
            message: `确定发布${projName}@${v}${tag ? ' tag=' + tag : ''}吗？(Y/N)`,
            name: 'confirm'
          }
        ], {}).then(({ confirm }) => {
          if (confirm.toLocaleLowerCase() === 'n') {
            fs.writeFileSync(projPath + '/package.json', oldPkgJsonData)
            console.log('取消发布')
            return
          }
          execSync(`npm pub ${tag ? '--tag=' + tag : ''}`, { cwd: projPath, stdio: 'inherit' })
        })
      })
      return
    }

    const matchedScripts = scripts.filter(s => s.indexOf(script) > -1)
    if (matchedScripts.length > 1) {
      inquirer.prompt([{
        type: 'search-list',
        name: 'matchedScript',
        message: '请选择需要运行命令',
        choices: matchedScripts
      }], {}).then(({ matchedScript }) => {
        execSync(`pnpm ${matchedScript}`, { cwd: projPath, stdio: 'inherit' })
      })
      return
    }

    // normal
    if (scripts.indexOf(script) > -1) {
      execSync(`pnpm ${script}`, { cwd: projPath, stdio: 'inherit' })
      return
    }

    console.log(`${projName}: 未发现dev script`)
  }

  const questionScript = [
    {
      type: 'search-list',
      name: 'script',
      message: '请选择需要运行命令',
      choices: scripts
    }
  ]

  inquirer.prompt(questionScript, {}).then(({ script }) => {
    execSync(`pnpm ${script}`, { cwd: projPath, stdio: 'inherit' })
  })
})

import fs from 'fs'
import { globSync } from 'glob'
const pkgs = globSync('packages/*')
const targetFolder = 'docs/changelog'
const mainPkg = 'packages/http-svc'
pkgs.forEach(async pkg => {
    try {
        const file = `${pkg}/CHANGELOG.md`
        fs.accessSync(file)
        const folderName = pkg.substring(9)
        const oData = fs.readFileSync(file, 'utf8')
        const pkgJSON = fs.readFileSync(`${pkg}/package.json`, 'utf8')
        if (pkg === mainPkg) {
            fs.writeFileSync('docs/guide/changelog.md', oData, 'utf8');
            return
        }
        const data = oData
            .replace('# CHANGELOG', `# ${JSON.parse(pkgJSON).name} CHANGELOG`)
        fs.writeFileSync(`${targetFolder}/${folderName}.md`, data, 'utf8');
    } catch {
        // continue
    }
})

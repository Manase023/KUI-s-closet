import { cpSync, existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'
import { join, resolve } from 'path'

const root = resolve('.')
const standalone = join(root, '.next', 'standalone')
const deploy = join(root, 'deploy')

// Step 1: Build
console.log('Building Next.js app...')
execSync('npm run build', { stdio: 'inherit', cwd: root })

// Step 2: Create deploy folder
if (existsSync(deploy)) {
  console.log('Removing old deploy folder...')
  execSync(process.platform === 'win32' ? `rmdir /s /q "${deploy}"` : `rm -rf "${deploy}"`, { stdio: 'inherit' })
}
mkdirSync(deploy, { recursive: true })

// Step 3: Copy standalone output
console.log('Copying standalone output...')
cpSync(standalone, deploy, { recursive: true })

// Step 4: Copy public folder
const publicDir = join(root, 'public')
if (existsSync(publicDir)) {
  console.log('Copying public/ folder...')
  cpSync(publicDir, join(deploy, 'public'), { recursive: true })
}

// Step 5: Copy static assets
const staticDir = join(root, '.next', 'static')
if (existsSync(staticDir)) {
  console.log('Copying .next/static/ folder...')
  cpSync(staticDir, join(deploy, '.next', 'static'), { recursive: true })
}

// Step 6: Copy database
const dataDir = join(root, 'data')
if (existsSync(dataDir)) {
  console.log('Copying data/ folder (database)...')
  cpSync(dataDir, join(deploy, 'data'), { recursive: true })
}

// Step 7: Copy migration/init scripts
const scriptsDir = join(root, 'scripts')
const deployScripts = join(deploy, 'scripts')
mkdirSync(deployScripts, { recursive: true })
for (const file of ['init-db.mjs', 'migrate.mjs']) {
  const src = join(scriptsDir, file)
  if (existsSync(src)) {
    cpSync(src, join(deployScripts, file))
  }
}

console.log('')
console.log('Deploy folder ready at: deploy/')
console.log('')
console.log('Upload the contents of the deploy/ folder to your HostAfrica app root.')
console.log('Set startup file to: server.js')

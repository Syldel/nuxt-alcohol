import { execSync } from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'
import { config } from 'dotenv'

// Lire les arguments : [--env prod] [--cmd generate] [--port 3002]
const args = process.argv.slice(2)

let env = 'dev'
let command = 'dev'
let port = 3001

args.forEach((arg, i) => {
  if (arg === '--env' && args[i + 1]) {
    env = args[i + 1]
  }
  if (arg === '--cmd' && args[i + 1]) {
    command = args[i + 1]
  }
  if (arg === '--port' && args[i + 1]) {
    port = args[i + 1]
  }
})

let envFile
switch (env) {
  case 'prod':
  case 'production':
    envFile = '.env.production'
    process.env.NODE_ENV = 'production'
    break
  case 'staging':
    envFile = '.env.staging'
    process.env.NODE_ENV = 'staging'
    break
  default:
    envFile = '.env'
    process.env.NODE_ENV = 'development'
    break
}

if (fs.existsSync(envFile)) {
  config({ path: envFile })
  // eslint-disable-next-line no-console
  console.log(`✅ Loaded ${envFile}`)
}
else {
  console.warn(`⚠️ Env file not found: ${envFile}`)
}

// eslint-disable-next-line no-console
console.log(`⚡ Running: nuxi ${command} --port ${port} (env: ${env})`)

try {
  execSync(`npx nuxi ${command} --port ${port}`, { stdio: 'inherit' })
}
catch (err) {
  console.error(`❌ Command failed: nuxi ${command}`)
  console.error(`error:`, err)
  process.exit(1)
}

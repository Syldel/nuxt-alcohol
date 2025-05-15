import fs from 'node:fs'
import process from 'node:process'
import { config } from 'dotenv'

/* eslint-disable no-console */
export function loadEnv() {
  // Récupérer tous les arguments passés en ligne de commande
  const args = process.argv.slice(2) // Exclut les 2 premiers éléments qui sont le chemin de Node et de Nuxt

  // Chercher l'argument `--env`
  const envArgIndex = args.indexOf('--env')
  const env = envArgIndex !== -1 ? args[envArgIndex + 1] : 'dev'

  // Déterminer l'environnement
  const nodeEnv = (env === 'prod' || env === 'production') ? 'production' : 'development'
  const envFile = `.env.${nodeEnv}`

  // Charger le fichier .env correspondant
  if (fs.existsSync(envFile)) {
    config({ path: envFile, override: true })
    console.log(`✅ Environment file loaded: ${envFile}`)
  }
  else if (fs.existsSync('.env')) {
    config({ path: '.env', override: true })
    console.log(`✅ Default .env file loaded (fallback)`)
  }
  else {
    console.warn(`⚠️ No environment file found`)
  }

  // Log des variables publiques
  const publicVars = Object.entries(process.env).filter(([key]) =>
    key.startsWith('NUXT_PUBLIC_'),
  )

  if (publicVars.length > 0) {
    console.log('Public NUXT_PUBLIC_* variables available:')
    for (const [key, value] of publicVars) {
      console.log(`- ${key}: ${value}`)
    }
  }
  else {
    console.warn('⚠️ No NUXT_PUBLIC_* variables found')
  }
}
/* eslint-enable no-console */

import { build } from 'esbuild'
import { rm } from 'node:fs/promises'

const outDir = 'dist-electron'

await rm(outDir, { recursive: true, force: true })

const shared = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['electron'],
  sourcemap: true,
  logLevel: 'info',
}

await build({
  ...shared,
  entryPoints: ['electron/main.ts'],
  outfile: `${outDir}/main.cjs`,
})

await build({
  ...shared,
  entryPoints: ['electron/preload.ts'],
  outfile: `${outDir}/preload.cjs`,
})

console.log(`Electron main/preload built to ${outDir}/`)

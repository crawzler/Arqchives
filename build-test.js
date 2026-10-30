const { spawn } = require('child_process')

const child = spawn('C:/Users/Guilherme/Desktop/Arqchives APP/node_modules/@esbuild/win32-x64/esbuild.exe', [
  'electron/main.ts', 
  'electron/preload.ts', 
  '--platform=node', 
  '--outdir=electron', 
  '--format=cjs', 
  '--bundle', 
  '--external:electron', 
  '--external:archiver'
], {
  cwd: 'C:/Users/Guilherme/Desktop/Arqchives APP',
  stdio: ['ignore', 'pipe', 'pipe']
})

child.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString())
})

child.stderr.on('data', (data) => {
  console.log('STDERR:', data.toString())
})

child.on('close', (code) => {
  console.log('Exit code:', code)
})
const fs = require('fs')
const file = 'C:/Users/Guilherme/Desktop/Arqchives APP/electron/main.ts'
const content = fs.readFileSync(file, 'utf-8')
// Remove the extra closing brace on a line by itself (line 106)
const lines = content.split('\n')
// Find and remove the extra } that's on a line by itself with 2 spaces
let removed = false
const newLines = lines.filter((line, i) => {
  if (i === 105 && line.trim() === '}' && lines[i-1].trim() === '}' && !removed) {
    removed = true
    return false
  }
  return true
})
if (!removed) {
  // Alternative: remove line 106 (0-indexed: 105)
  if (lines[105].trim() === '}' && lines[104].trim() === '}') {
    lines.splice(105, 1)
    removed = true
  }
}
fs.writeFileSync(file, newLines.join('\n'))
console.log('Fixed:', removed)
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let updated = false;
  let idx = 0;
  
  while (true) {
    idx = content.indexOf('navItems.map', idx);
    if (idx === -1) break;
    
    // Find the end of this nav sidebar section (usually marked by </nav>)
    let endIdx = content.indexOf('</nav>', idx);
    if (endIdx === -1) {
      endIdx = idx + 1200; // fallback window
    } else {
      endIdx += 6; // include </nav> tag
    }
    
    let sub = content.substring(idx, endIdx);
    const subRegex = /<span>\s*\{\s*item\.name\s*\}\s*<\/span>/g;
    
    if (subRegex.test(sub)) {
      console.log(`Updating navItems.map block in ${file}`);
      sub = sub.replace(subRegex, '<span>{item.name.replace(" (Active)", "")}{item.active ? " (Active)" : ""}</span>');
      content = content.substring(0, idx) + sub + content.substring(endIdx);
      updated = true;
    }
    
    idx += sub.length;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`No updates made in ${file}`);
  }
});

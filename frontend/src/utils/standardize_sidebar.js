const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to find <span>{item.name}</span> with optional spaces
  const regex = /<span>\s*\{\s*item\.name\s*\}\s*<\/span>/g;
  
  if (regex.test(content)) {
    console.log(`Updating sidebar label rendering in: ${file}`);
    const updatedContent = content.replace(regex, '<span>{item.name.replace(" (Active)", "")}{item.active ? " (Active)" : ""}</span>');
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  } else {
    console.log(`No matching pattern in: ${file}`);
  }
});

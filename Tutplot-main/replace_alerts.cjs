const fs = require('fs');
const path = require('path');

const srcDir = 'src';
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('alert(')) {
    if (!content.includes('import toast')) {
      content = "import toast from 'react-hot-toast';\n" + content;
    }
    
    // Replace alert(...) with toast.success or toast.error
    content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
      const lower = p1.toLowerCase();
      if (lower.includes('success') || lower.includes('saved')) {
        return `toast.success(${p1})`;
      } else if (lower.includes('fail') || lower.includes('error') || lower.includes('please')) {
        return `toast.error(${p1})`;
      } else {
        return `toast(${p1})`;
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});

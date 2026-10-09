const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, 'public', 'images', 'clients');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const logos = [
  { name: 'unilever', url: 'https://alhyder.com/wp-content/uploads/2025/08/Unilever.svg', ext: '.svg' },
  { name: 'nestle', url: 'https://alhyder.com/wp-content/uploads/2025/08/nestle-9-logo-png-transparent.png', ext: '.png' },
  { name: 'lipton', url: 'https://alhyder.com/wp-content/uploads/2025/08/Lipton_logo_2014-present.svg', ext: '.svg' },
  { name: 'sngpl', url: 'https://alhyder.com/wp-content/uploads/2025/08/SNGPL_logo.svg.png', ext: '.png' },
  { name: 'orient', url: 'https://alhyder.com/wp-content/uploads/2025/08/orient-logo-png_seeklogo-271630.png', ext: '.png' },
  { name: 'asset_150057', url: 'https://alhyder.com/wp-content/uploads/2025/08/150057.svg', ext: '.svg' },
  { name: 'berger-paints', url: 'https://alhyder.com/wp-content/uploads/2025/08/betger.png', ext: '.png' },
  { name: 'interloop', url: 'https://alhyder.com/wp-content/uploads/2025/08/interloop_limited_logo.jpeg', ext: '.jpeg' },
  { name: 'waves-pakistan', url: 'https://alhyder.com/wp-content/uploads/2025/08/waves-pakistan-176568.png', ext: '.png' },
  { name: 'nimir', url: 'https://alhyder.com/wp-content/uploads/2025/08/NIMIR-New-Logo-1-1024x205-1.png', ext: '.png' },
  { name: 'ghani-gases', url: 'https://alhyder.com/wp-content/uploads/2025/08/ee84e7a2-1229-42e9-87ba-43e55c47f8c2.png', ext: '.png' },
  { name: 'ok-gas', url: 'https://alhyder.com/wp-content/uploads/2025/08/ok_gas.png', ext: '.png' },
  { name: 'uil', url: 'https://alhyder.com/wp-content/uploads/2025/08/uil_logo.webp', ext: '.webp' },
  { name: 'al-moiz', url: 'https://alhyder.com/wp-content/uploads/2025/08/al_moiz.jpeg', ext: '.jpeg' },
  { name: 'meezan-beverages', url: 'https://alhyder.com/wp-content/uploads/2025/08/meezan.png', ext: '.png' },
  { name: 'pepsico', url: 'https://alhyder.com/wp-content/uploads/2025/08/PepsiCo_logo.svg.png', ext: '.png' },
  { name: 'ebm', url: 'https://alhyder.com/wp-content/uploads/2025/08/ebm-logo.png', ext: '.png' },
  { name: 'iffco', url: 'https://alhyder.com/wp-content/uploads/2025/08/iffco_logo.png', ext: '.png' },
  { name: 'coronet-foods', url: 'https://alhyder.com/wp-content/uploads/2025/08/coronet_food.png', ext: '.png' },
  { name: 'shan-foods', url: 'https://alhyder.com/wp-content/uploads/2025/08/Shan-Logo-PNG.png', ext: '.png' },
  { name: 'haidri-beverages', url: 'https://alhyder.com/wp-content/uploads/2025/08/haidri_beverages.png', ext: '.png' },
  { name: 'shezan', url: 'https://alhyder.com/wp-content/uploads/2025/08/Shezan_logo.gif', ext: '.gif' },
  { name: 'snds', url: 'https://alhyder.com/wp-content/uploads/2025/08/snds_logo.jpeg', ext: '.jpeg' },
  { name: 'treet-corp', url: 'https://alhyder.com/wp-content/uploads/2025/08/Treet_Corp_logo_2024.png', ext: '.png' },
];

function downloadFile(item) {
  return new Promise((resolve) => {
    const filePath = path.join(targetDir, item.name + item.ext);
    const file = fs.createWriteStream(filePath);
    
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${item.name} (${fs.statSync(filePath).size} bytes)`);
            resolve();
          });
        }).on('error', (err) => {
          console.error(`Error redirect ${item.name}:`, err.message);
          resolve();
        });
        return;
      }
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${item.name} (${fs.statSync(filePath).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${item.name}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log('Downloading official Al Hayder client logos...');
  for (const item of logos) {
    await downloadFile(item);
  }
  console.log('All downloads completed!');
}

run();

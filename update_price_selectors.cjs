const fs = require('fs');

// config.json dosyasını okuma
const configFile = './config.json';
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

// Hepsiburada, N11 ve Mediamarkt için güncellenmiş price selector'lar
config.products.forEach(product => {
  if (product.url.includes('hepsiburada')) {
    product.price_selector = '#container > div > main > div > div > div:nth-child(2) > section.X7UOpIDPCas7K8jG8_5Y > div.EVw3R49mJ4tM_lgmN7E_ > div.foQSHpIYwZWy8nHeqapl.QfKHfu57dLi9hPNDl1UL > div > div.IMDzXKdZKh810YOI6k5Q > div.z7kokklsVwh0K5zFWjIO > span';
  }
  if (product.url.includes('n11')) {
    product.price_selector = '#unf-p-id > div > div:nth-child(2) > div.unf-p-cvr > div.unf-p-left > div > div.unf-p-detail > div.unf-price-cover > div.price-cover > div.price > div > div > div.displayPrice';
  }
  if (product.url.includes('mediamarkt')) {
    product.price_selector = '#StyledPdpWrapper > div:nth-child(1) > div.sc-835d3f28-0.kTdeVZ.sc-1cc27df0-1.evwOIA > div.sc-a06385e1-0.lpnPyG.sc-1cc27df0-7.bjjOVg > section.sc-f3ef82d2-0.cibuVt > div.sc-4ec8abff-0.hzUXOE > div > div > div > div.sc-b350c14-0.jmGmkg.sc-6db49389-0.bbxSql > span';
  }
});

// config.json dosyasına yazma
fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
console.log('Config.json dosyası güncellendi!');

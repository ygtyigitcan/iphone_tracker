# Base image olarak Playwright'i kullanıyoruz
FROM mcr.microsoft.com/playwright:v1.28.0-focal

# Çalışma dizinini /app olarak ayarlıyoruz
WORKDIR /app

# Gerekli bağımlılıkları yüklüyoruz ve Chromium tarayıcısını yüklemeyi deniyoruz
RUN apt-get update && apt-get install -y chromium-browser

# Uygulamanın bağımlılıklarını kuruyoruz
COPY . /app
RUN npm install

# Chromium tarayıcısının doğru yolda olduğundan emin olmak için
RUN ln -s /usr/bin/chromium-browser /usr/bin/chrome

# Scraper dosyasını çalıştırıyoruz
CMD ["node", "scraper.cjs"]

# Используем официальный Node.js образ
FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json / yarn.lock
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Генерация Prisma Client (если используется)
RUN npx prisma generate

# Отключаем телеметрию
RUN npx next telemetry disable

# Сборка проекта
RUN npm run build

# Указываем порт 
EXPOSE 3000
EXPOSE 8080

# Запуск приложения
CMD ["sh", "-c", "npm run admin & npx prisma migrate deploy && npm start"]

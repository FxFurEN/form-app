FROM node:16 AS build

WORKDIR /app

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

COPY ./frontend .
RUN npm run build

# Stage 2: Сборка серверной части
FROM node:16

WORKDIR /app

COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm install

COPY ./backend .
COPY --from=build /app/build ./public

CMD ["node", "index.js"]

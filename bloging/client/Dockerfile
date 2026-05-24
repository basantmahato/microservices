FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY index.html ./
COPY src ./src
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY serve.cjs ./
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV CLIENT_PORT=5173

EXPOSE 5173

CMD ["npm", "start"]

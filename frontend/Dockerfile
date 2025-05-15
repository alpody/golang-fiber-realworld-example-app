FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN ls -la && ls -la .next

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV API_BASE_URL=http://localhost:8585/api

CMD ["npm", "run", "start"]

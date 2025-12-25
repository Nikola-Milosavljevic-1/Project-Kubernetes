FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force

COPY --chown=nodejs:nodejs src ./src

USER nodejs

EXPOSE 5050


CMD ["node", "src/app.js"]

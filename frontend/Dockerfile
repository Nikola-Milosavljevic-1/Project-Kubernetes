FROM node:20-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm install http-server && \
    npm cache clean --force

COPY --chown=nodejs:nodejs *.html ./
COPY --chown=nodejs:nodejs *.js ./
COPY --chown=nodejs:nodejs *.d.ts ./

USER nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["npx", "http-server", "-p", "8080" "-a", "0.0.0.0" "-c-1"]
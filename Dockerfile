FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /app

ADD assets ./assets
ADD .nais ./.nais
ADD node_dist ./node_dist
ADD frontend_production ./frontend_production
ADD node_modules ./node_modules
ADD package.json .

ENV NODE_ENV production

CMD ["--import=./node_dist/registerESMLoader.js","--es-module-specifier-resolution=node", "node_dist/server.js"]

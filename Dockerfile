FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24

WORKDIR /app

COPY assets ./assets
COPY dist_backend ./dist_backend
COPY dist_frontend ./dist_frontend
COPY node_modules ./node_modules
COPY package.json .

ENV NODE_ENV=production

CMD ["dist_backend/server.js"]

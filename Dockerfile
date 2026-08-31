FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app

COPY assets ./assets
COPY dist_backend ./dist_backend
COPY dist_frontend ./dist_frontend

# dist_backend/node_modules inneholder kun de avhengighetene backend faktisk bruker
# (sporet med @vercel/nft i scripts/prune-backend-node-modules.js), så vi slipper
# å kopiere hele node_modules inn i imaget. package.json trengs for at 'import' skal fungere.
COPY package.json .

ENV NODE_ENV=production

CMD ["dist_backend/server.js"]

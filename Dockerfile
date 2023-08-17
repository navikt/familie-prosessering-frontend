FROM gcr.io/distroless/nodejs:18

WORKDIR /app/server

ADD assets ./assets
ADD build_n_deploy ./build_n_deploy
ADD node_dist ./node_dist
ADD frontend_production ./frontend_production
ADD node_modules ./node_modules
ADD package.json .

ENV NODE_ENV production
EXPOSE 8000
CMD ["--es-module-specifier-resolution=node", "node_dist/server.js"]

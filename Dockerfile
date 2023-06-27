FROM cgr.dev/chainguard/node:18

WORKDIR /app/server

ADD ./ /var/server/

EXPOSE 8000
CMD ["/usr/bin/npm", "run", "start"]
FROM navikt/node-express:14-alpine

ADD ./ /var/server/

EXPOSE 8000
CMD ["yarn", "start"]
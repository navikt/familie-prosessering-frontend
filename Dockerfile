FROM navikt/node-express:12.2.0-alpine
RUN apk --no-cache add curl

ADD ./ /var/server/

RUN yarn
RUN yarn build:prod

EXPOSE 8000
CMD ["yarn", "start"]
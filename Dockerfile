FROM node:10.6.0 AS development

WORKDIR /usr/src/app
RUN chown -R node:node .
USER node

COPY --chown=node:node ./package.json ./yarn.lock ./
RUN yarn install
COPY --chown=node:node . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "dev"]

HEALTHCHECK CMD curl -f http://localhost:3000/ping/ || exit 1


FROM development AS production

RUN  yarn install --production --ignore-scripts --prefer-offline \
    && yarn cache clean

CMD ["yarn", "run", "start"]

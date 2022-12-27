FROM node:16.14.0 as install
FROM cypress/included:11.2.0 as cypress

WORKDIR /tests

COPY ./package.json /tests/package.json
COPY ./tsconfig.json /tests/tsconfig.json

RUN npm install -g pnpm
RUN pnpm install

ADD ./e2e /tests/e2e
COPY ./cypress.config.ts /tests/cypress.config.ts

RUN pnpm run cypress:run
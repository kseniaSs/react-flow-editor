FROM node:16.14.0 as install
FROM cypress/included:11.2.0 as cypress

WORKDIR /flow-editor

ADD . /flow-editor

RUN npm install -g pnpm
RUN pnpm install

RUN cd packages/examples && pnpm dev &
RUN cd packages/e2e && pnpm run cypress:run


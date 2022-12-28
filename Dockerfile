FROM node:16.14.0 as flow-editor-install

WORKDIR /flow-editor
ADD . /flow-editor
RUN npm install -g pnpm
RUN npm install -g vite
RUN pnpm install

FROM cypress/included:11.2.0 as cypress

WORKDIR /flow-editor
COPY --from=flow-editor-install /flow-editor /flow-editor
COPY ./packages/e2e/cypress.config.ts /flow-editor
RUN npm install -g pnpm
ENV UNDER_DOCKER=true

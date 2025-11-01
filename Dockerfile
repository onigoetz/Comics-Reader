FROM node:22.21.1-alpine AS base 

RUN corepack enable

WORKDIR /app

FROM base AS builder

# Run yarn install early to allow a quick
# rebuild if the package.json didn't change
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

RUN apk add --no-cache --virtual .gyp g++ make python3 && yarn install

COPY comics next.config.mjs ./
COPY public/ ./public/
COPY server/ ./server/
COPY src/ ./src/

RUN yarn build

FROM base AS runner

RUN apk add --no-cache mupdf-tools

# Symlink volume
VOLUME /comics
VOLUME /cache
RUN ln -s /comics /app/images && ln -s /cache /app/cache

ENV NODE_ENV production

COPY --from=builder /app ./

EXPOSE 8080

CMD [ "node", "server/index.js" ]

# Build Node JS image with web service
FROM alpine:3.14 AS IMAGE_NODE

ENV NODE_ENV production
RUN echo "Install Node JS"\
	&& apk add --no-cache --update nodejs curl bash\
	&& apk add --no-cache --update npm\
	&& rm -rf /var/cache/apk/*\
	&& npm --no-cache install -g yarn

WORKDIR /usr/src/app/web
COPY ./src/ .

RUN echo "Install dependencies and build web app."\
	&& yarn install --frozen-lockfile \
	&& curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin\
	&& yarn cache clean\
	&& /usr/local/bin/node-prune

# CMD node dist/server.js

# Build image with web and bots services
FROM alpine:3.14 AS IMAGE_WORKER

WORKDIR /usr/src/app/web

RUN apk add --no-cache --update nodejs\
	&& rm -rf /var/cache/apk/*

COPY --from=IMAGE_NODE /usr/src/app/web/src ./src
COPY --from=IMAGE_NODE /usr/src/app/web/package.json ./package.json
COPY --from=IMAGE_NODE /usr/src/app/web/node_modules ./node_modules

CMD node  --experimental-specifier-resolution=node src/index.mjs
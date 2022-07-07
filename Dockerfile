## STAGE: Base ##
FROM node:14-alpine as base
WORKDIR /app
ARG GHP_TOKEN
COPY package.json .
COPY .npmrc .
RUN apk add --no-cache --virtual build-base
RUN npm install -g node-gyp && npm install
RUN apk del build-base
RUN wget https://github.com/eficode/wait-for/releases/latest/download/wait-for -O /wait-for
RUN chmod +x /wait-for
COPY . .
RUN chmod +x ./scripts/wait-for-all.sh &&\
    rm .npmrc

## STAGE: Development ##
FROM base as development
ENV NODE_ENV=development
ENV GHP_TOKEN=${GHP_TOKEN}
VOLUME [ "/app" ]
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

## STAGE: Build ##
FROM base as build
ENV NODE_ENV=production
RUN npm run build

## STAGE: Production ##
FROM build as production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist .
COPY --from=build /app/node_modules .
COPY --from=build /app/package.json .

EXPOSE 3000
CMD ["npm", "run", "start:prod"]

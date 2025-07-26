## Stage 1: build
#FROM node:20-alpine AS builder
#WORKDIR /app
#
#COPY package*.json ./
#RUN yarn install
#
#COPY . .
#RUN yarn run build
#
## Stage 2: production image
#FROM node:20-alpine
#WORKDIR /app
#
#COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/ormconfig.js ./ormconfig.js
#COPY --from=builder /app/src/migrations ./src/migrations
#
#ENV NODE_ENV=production
#EXPOSE 3000
#
#CMD ["node", "dist/main"]


#FROM node:20-alpine
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN yarn install
#
#COPY . .
#
#RUN yarn run build
#
#EXPOSE 3000
#
#CMD ["node", "dist/main"]

# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]
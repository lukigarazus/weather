# Base image
FROM node:20.6.1-slim

COPY . .

RUN yarn install
RUN yarn install:all

CMD ["yarn", "start:all"]

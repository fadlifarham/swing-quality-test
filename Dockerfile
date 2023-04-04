FROM node:lts-alpine as build

RUN apk add tzdata && yarn global add sequelize-cli

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

RUN cp .env.example .env

EXPOSE 4002

ENV TZ=Asia/Jakarta

ENV NODE_OPTIONS=”–max_old_space_size=2048″

CMD ["yarn","start"]
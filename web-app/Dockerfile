FROM node:11-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY . .

EXPOSE 5000

CMD ["serve", "-p", "5000"]
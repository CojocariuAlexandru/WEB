FROM node:12

WORKDIR /usr/src/app

RUN npm install -g serve

COPY . .

EXPOSE 5000

CMD ["serve", "-p", "5000"]
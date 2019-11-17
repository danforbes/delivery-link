FROM node:alpine

WORKDIR /easypost-adapter
ADD . .

ENV PORT=8080
EXPOSE 8080

RUN npm install
ENTRYPOINT ["node", "server.js"]

FROM node:20 as development

WORKDIR /app
COPY  package.json .
RUN npm install
COPY . .
EXPOSE 2000
CMD [ "npm","start" ]

FROM node:20 as production

WORKDIR /app
COPY  package.json .
RUN npm install --only=production
COPY . .
EXPOSE 2000
CMD [ "npm","run","start:prod" ]

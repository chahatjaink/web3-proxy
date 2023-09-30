FROM node:bullseye-slim

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

EXPOSE 3001 8787 

CMD ["npm", "run", "start"]

FROM node:18
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install -g rimraf copyfiles
RUN npm install --only=production
COPY ./dist/src ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

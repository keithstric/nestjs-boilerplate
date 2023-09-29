################
# Build Step 1 #
################
FROM node:16 as devBuild
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install -g rimraf
RUN npm install -D
COPY . .
RUN npm run build

################
# Build Step 2 #
################
FROM node:16-alpine
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install -g rimraf copyfiles
RUN npm install --only=production
COPY . .
COPY --from=devBuild usr/src/app/dist ./dist
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

FROM node:10

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Run build
COPY . .
RUN npm run build

# Start server
EXPOSE 5000
CMD ["node", "backend/index.js"]
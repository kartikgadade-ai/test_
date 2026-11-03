# Start from a ready-made image that already has Node.js installed
FROM node:20-alpine

# Work inside the /usr/src/app folder in the container
WORKDIR /usr/src/app

# Copy package files first, then install libraries
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the code
COPY . .

# Tell Docker the app listens on port 3000
EXPOSE 3000

# The command that starts the app
CMD ["node", "app.js"]
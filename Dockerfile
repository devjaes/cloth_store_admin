# Use an official Node.js 20 runtime as the parent image
FROM node:18.18.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install nodemon globally and app dependencies
RUN npm install -g nodemon && npm install --no-optional

# Copy the rest of the application source inside the container
COPY . .

# Specify the command to run when the container starts using nodemon
CMD [ "nodemon", "run", "start:dev" ]

# Expose port 3002 for the application
EXPOSE 3002

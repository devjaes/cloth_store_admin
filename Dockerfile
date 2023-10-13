# Use an official Node.js 20 runtime as the parent image
FROM node:20.8.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container (si tienes package-lock.json)
COPY package.json ./

# Install nodemon globally
RUN npm install -g nodemon

# Install application dependencies in the container using npm
RUN npm install

# Copy the rest of the application source inside the container
COPY . .

# Specify the command to run when the container starts using nodemon
CMD [ "npm", "run", "start:dev" ]  
# Asumo que tu punto de entrada es "index.js". Ajusta si es diferente.

# Expose port 3002 for the application
EXPOSE 3002

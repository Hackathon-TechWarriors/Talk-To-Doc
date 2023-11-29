# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build your React app for production
RUN npm run build

# Expose port 80
EXPOSE 80

# Define the command to start the server
CMD ["npm", "start"]

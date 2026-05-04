FROM node:20-alpine

WORKDIR /app

# Copy package json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all local files into the image
COPY . .

# Expose Next.js port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

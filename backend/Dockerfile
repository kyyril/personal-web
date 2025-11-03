# Use the official Bun image as the base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and bun.lock to install dependencies
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN bun prisma generate

# Build the TypeScript application
RUN bun run build

EXPOSE 5000

# Start the application
CMD ["bun", "run", "start"]
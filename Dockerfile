# Stage 1: Building the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Stage 2: Running the app
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "run", "start"]

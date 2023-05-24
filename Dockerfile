# Compile tsc and generate prisma client
FROM node:18.16.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "npm", "run", "build"]

# Serve the final compiled app
FROM node:18.16.0
ARG PORT=3000
ARG DATABASE_URL=DATABASE_URL
WORKDIR /app
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/
ENV DATABASE_URL=${DATABASE_URL}
EXPOSE ${PORT}
RUN ["node", "dist/index.js"]

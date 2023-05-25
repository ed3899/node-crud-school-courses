# Compile tsc
FROM node:18.16.0 AS builder
WORKDIR /app
COPY . .
RUN ["npm", "ci"]
RUN ["npm", "run", "compile"]

# Run db migrations, uninstall prisma and serve the final compiled app (npm start)
FROM node:18.16.0
ARG PORT=3000
WORKDIR /app
COPY --from=builder /app/prisma/ ./prisma/
COPY --from=builder /app/dist/ ./dist/
COPY package*.json ./
RUN ["npm", "ci", "--omit=dev"]
EXPOSE ${PORT}
CMD [ "sh", "-c", "DATABASE_URL=$(cat /run/secrets/db_url) npm start" ]
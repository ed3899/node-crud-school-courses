# Compile tsc
FROM node:18.16.0 AS builder
WORKDIR /app
COPY . .
RUN ["npm", "install"]
RUN ["npm","run", "build"]

# Run db migrations and serve the final compiled app
FROM node:18.16.0
ARG DATABASE_URL=DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG PORT=3000
WORKDIR /app
COPY ./prisma ./prisma/
COPY --from=builder /app/dist/ ./dist/
COPY package*.json ./
RUN ["npm", "install"]
EXPOSE ${PORT}
CMD npm run db:deploy && npm run serve

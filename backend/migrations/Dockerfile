FROM golang:1.22-alpine

WORKDIR /app
COPY migrations/schema.sql ./schema.sql

RUN apk update && apk add --no-cache postgresql-client

CMD ["sh", "/app/wait-for-postgres.sh"]

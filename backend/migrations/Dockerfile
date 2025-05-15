FROM golang:1.22-alpine

WORKDIR /go/src/app
COPY migrations/schema.sql ./migrations/schema.sql

RUN apk update && apk add --no-cache postgresql-client

CMD ["sh", "-c", "until psql $DATABASE_URL -c 'select 1;'; do sleep 1; done; psql $DATABASE_URL -f migrations/schema.sql"]
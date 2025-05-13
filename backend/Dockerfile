FROM golang:1.22-alpine3.18 AS builder

RUN apk add --update gcc musl-dev postgresql-dev git

RUN mkdir -p /myapp
ADD . /myapp
WORKDIR /myapp

RUN adduser -u 10001 -D myapp

RUN go install github.com/swaggo/swag/cmd/swag@latest && \
    swag init && \
    CGO_ENABLED=1 go build -v -o myapp .

RUN chown myapp: ./database


FROM alpine:3.18

RUN apk --no-cache add ca-certificates postgresql-client

COPY --from=builder /etc/passwd /etc/passwd
USER myapp

WORKDIR /myapp

COPY --from=builder /etc/ssl/certs/ /etc/ssl/certs/
COPY --from=builder /myapp/myapp ./myapp
COPY --from=builder /myapp/database ./database
COPY --from=builder /myapp/config ./config
COPY --from=builder /myapp/.env.example ./.env.example

VOLUME ["/myapp/database", "/myapp/config"]

CMD ["./myapp"]

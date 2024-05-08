FROM golang:1.22.3-alpine3.18 AS builder

RUN apk add --update gcc musl-dev
RUN mkdir -p /myapp
ADD . /myapp
WORKDIR /myapp

RUN adduser -u 10001 -D myapp

RUN  go install github.com/swaggo/swag/cmd/swag@latest  &&  go generate . && GOOS=linux GOARCH=amd64 CGO_ENABLED=1  go build -ldflags='-extldflags=-static'  -o myapp .

#RUN make build-static 
RUN chown myapp: ./database


FROM scratch 

COPY --from=builder /etc/passwd /etc/passwd
USER myapp

WORKDIR /myapp

#COPY --from=builder /etc/ssl/certs/ /etc/ssl/certs/
COPY --from=builder /myapp/myapp ./myapp
COPY --from=builder /myapp/database ./database
VOLUME ./database
CMD ["./myapp"]


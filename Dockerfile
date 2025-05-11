FROM golang:1.22-alpine3.18 AS builder

# Install necessary build dependencies
RUN apk add --update gcc musl-dev postgresql-dev git

# Set up working directory
RUN mkdir -p /myapp
ADD . /myapp
WORKDIR /myapp

# Create user
RUN adduser -u 10001 -D myapp

# Install swag, generate docs, and build the app with better error visibility
RUN go install github.com/swaggo/swag/cmd/swag@latest && \
    swag init && \
    CGO_ENABLED=1 go build -v -o myapp .

# Set permissions
RUN chown myapp: ./database


FROM alpine:3.18

# Install necessary runtime dependencies
RUN apk --no-cache add ca-certificates postgresql-client

# Setup user
COPY --from=builder /etc/passwd /etc/passwd
USER myapp

WORKDIR /myapp

# Copy files from builder
COPY --from=builder /etc/ssl/certs/ /etc/ssl/certs/
COPY --from=builder /myapp/myapp ./myapp
COPY --from=builder /myapp/database ./database
COPY --from=builder /myapp/config ./config
COPY --from=builder /myapp/.env.example ./.env.example

# Configure volumes
VOLUME ["/myapp/database", "/myapp/config"]

# Run the application
CMD ["./myapp"]

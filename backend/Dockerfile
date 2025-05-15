# Stage 1: Build the Go modules
FROM golang:1.22.4 AS modules
ENV GOPROXY=https://proxy.golang.org,direct
WORKDIR /modules
COPY go.mod go.sum ./
RUN go mod download

# Stage 2: Build the Go application
FROM golang:1.22.4 AS builder
WORKDIR /realworld
COPY --from=modules /go/pkg /go/pkg
COPY . .
WORKDIR /realworld/cmd/realworld
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /realworld/realworld .

# Stage 3: Create the final image
FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /realworld/realworld /realworld
EXPOSE 3000
ENTRYPOINT ["/realworld"]

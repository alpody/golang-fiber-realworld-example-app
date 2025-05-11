#!/bin/sh
set -e

# Print section header
section() {
  echo "===> $1"
}

# Create necessary directories
section "Setting up directories"
mkdir -p ./database ./config
chmod o+w ./database 

# Check if .env exists, if not copy from example
section "Setting up environment"
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env file from example"
  else
    echo "Warning: No .env or .env.example file found"
    # Create a minimal env file
    cat > .env << EOF
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=realworld
DB_SSLMODE=disable
EOF
    echo "Created minimal .env file"
  fi
fi

# Build the application first
section "Building Docker images"
docker-compose build --no-cache

# Start Postgres container separately
section "Starting PostgreSQL"
docker-compose up -d postgres
echo "Waiting for PostgreSQL to be ready..."

# Better wait for PostgreSQL to be ready using pg_isready
for i in {1..30}; do
  if docker-compose exec postgres pg_isready -h localhost -U postgres > /dev/null 2>&1; then
    echo "PostgreSQL is ready!"
    break
  fi
  echo "Waiting... ($i/30)"
  sleep 2
  if [ $i -eq 30 ]; then
    echo "Error: PostgreSQL failed to start in time"
    docker-compose logs postgres
    exit 1
  fi
done

# Start the application
section "Starting application"
docker-compose up --abort-on-container-exit fiber-realworld newman-checker

# Clean up after exit
section "Cleaning up"
docker-compose down
echo "Done!"

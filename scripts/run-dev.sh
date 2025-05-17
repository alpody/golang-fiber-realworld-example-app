#!/bin/bash

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

print_header() {
    echo -e "${GREEN}=== $1 ===${NC}"
}

print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    DOCKER_COMPOSE="docker-compose"
fi

setup_env_files() {
    print_header "Setting up environment files"

    if [ -f "$PROJECT_ROOT/backend/.env.example" ] && [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
        cp "$PROJECT_ROOT/backend/.env.example" "$PROJECT_ROOT/backend/.env"
        echo "Created backend/.env from example"
    fi

    if [ -f "$PROJECT_ROOT/frontend/.env.example" ] && [ ! -f "$PROJECT_ROOT/frontend/.env.local" ]; then
        cp "$PROJECT_ROOT/frontend/.env.example" "$PROJECT_ROOT/frontend/.env.local"
        echo "Created frontend/.env.local from example"
    fi
}

run_development() {
    cd "$PROJECT_ROOT"

    if [ ! -f "$PROJECT_ROOT/compose.dev.yml" ]; then
        print_error "compose.dev.yml not found."
        exit 1
    fi

    # Stop any existing containers and remove volumes if requested
    if [ "$1" == "--fresh" ] || [ "$1" == "-f" ]; then
        print_warning "Removing all existing containers and volumes..."
        $DOCKER_COMPOSE -f compose.dev.yml down -v
    else
        $DOCKER_COMPOSE -f compose.dev.yml down
    fi

    # Start the development environment
    print_header "Building and starting services"
    $DOCKER_COMPOSE -f compose.dev.yml up --build -d postgres

    # Wait for PostgreSQL to be ready
    print_header "Waiting for PostgreSQL to be ready"
    until $DOCKER_COMPOSE -f compose.dev.yml exec postgres pg_isready -U postgres -d realworld; do
        echo "PostgreSQL is not ready yet... waiting"
        sleep 2
    done

    # Start backend and frontend
    print_header "Starting backend and frontend services"
    $DOCKER_COMPOSE -f compose.dev.yml up --build
}

# Main execution
print_header "SNA25 Development Environment"

# Setup environment files
setup_env_files

# Run development environment
run_development "$@"

#!/bin/sh
set -e

host="postgres"
port="5432"
user="postgres"
password="postgres"
db="realworld"

echo "Waiting for PostgreSQL..."

until PGPASSWORD=$password psql -h "$host" -U "$user" -d "$db" -c '\q'; do
  echo >&2 "Postgres is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing schema"

PGPASSWORD=$password psql -h "$host" -U "$user" -d "$db" -f /app/schema.sql

echo "Schema applied successfully"

exec "$@"

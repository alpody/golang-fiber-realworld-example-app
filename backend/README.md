# ![RealWorld Example App](logo.png)

> ### Fiber + SQLC codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Fiber + SQLC** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Fiber + SQLC** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

The RealWorld Fiber SQLC application is a backend example app demonstrating best practices for CRUD operations, authentication, and more, adhering to the RealWorld specification.

### Backend
- **Language**: Go
- **Framework**: Fiber
- **Database**: PostgreSQL
- **SQL Queries**: sqlc (generates type-safe code from SQL)

### Structure
- **cmd/realworld**: Entry point of the application.
- **internal**: Core application logic, including handlers, middleware, and database interactions.
- **pkg**: Reusable packages.
- **usecase/dto**: Data transfer objects for use cases.

### Deployment
- **Docker**: Utilizes Docker and Docker Compose for containerization.

### Configuration
- **sqlc.yaml**: Configuration for sqlc to generate Go code from SQL queries.
- **docker-compose.yml**: Configuration for Docker Compose to set up the application's services.

### Additional Features
- **Routing**: Managed by Fiber.
- **Authentication**: JWT-based authentication.
- **Testing**: Simple unit test.

# Getting started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/dashhhik/realworld-fiber-sqlc.git
   cd realworld-fiber-sqlc

2. Build and run the services using Docker Compose:
   ```sh
   docker-compose up --build
   ```



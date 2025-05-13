# ![RealWorld Example App](logo.png)

> ### [Golang/Fiber](https://gofiber.io) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API. Project based on [RealWorld example](https://github.com/xesina/golang-echo-realworld-example-app/) for [Golang/Echo](https://echo.labstack.com/)


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with Golang/Fiber including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the [Golang/Fiber](https://gofiber.io) community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


## Quick start

Before quick start you must install [docker](https://www.docker.com), [docker-compose](https://docs.docker.com/compose/)  and [Git](https://git-scm.com/).

**Starts ready docker container**

```bash
mkdir database && chmod o+w ./database && docker run -d -p 8585:8585 -v $(pwd)/database:/myapp/database alpody/golang-fiber-real-world 
```

**Builds and tests**

```bash
git clone https://github.com/alpody/golang-fiber-realworld-example-app.git
cd golang-fiber-realworld-example-app 
chmod a+x start.sh
./start.sh
```
Press <code>Ctrl + c</code> for stop application.

See asciinema this process:

[![asciicast](https://asciinema.org/a/eyZ5upSyv9IJyE36g4sj3ZBBw.svg)](https://asciinema.org/a/eyZ5upSyv9IJyE36g4sj3ZBBw)

## Getting started

### Install Golang (go1.11+)

Please check the official golang installation guide before you start. [Official Documentation](https://golang.org/doc/install)
Also make sure you have installed a go1.11+ version.

### Environment Config

make sure your ~/.*shrc have those variable:

```bash
➜  echo $GOPATH
/Users/xesina/go
➜  echo $GOROOT
/usr/local/go/
➜  echo $PATH
...:/usr/local/go/bin:/Users/alpody/test/bin:/usr/local/go/bin
```

For more info and detailed instructions please check this guide: [Setting GOPATH](https://github.com/golang/go/wiki/SettingGOPATH)

### Clone the repository

Clone this repository:

```bash
➜ git clone https://github.com/alpody/golang-fiber-realworld-example-app.git
```

Or simply use the following command which will handle cloning the repo:

```bash
➜ go get -u -v github.com/alpody/golang-fiber-realworld-example-app
```

Switch to the repo folder

```bash
➜ cd $GOPATH/src/github.com/alpody/golang-fiber-realworld-example-app
```

### Working with makefile

If you had installed make utility, you can simply run and select command. 

```bash
make help
```

### Install dependencies

```bash
➜ go mod download
```

### Run

```bash
➜ go run main.go
```

### Build

```bash
➜ go build
```

### Tests

```bash
➜ go test ./...
```
### Swagger UI

Open url http://localhost:8585/swagger/index.html in browser.

![2021-10-07_17-01-27](https://user-images.githubusercontent.com/13846803/136400503-fedd869c-4508-4699-a79b-66e0bbd765e2.png)



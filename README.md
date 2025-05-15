# Group Project Assignment

[S25] System and Network Administration / Innopolis University

### Team Members

| Name              | Email                            | Group     |
| ----------------- | -------------------------------- | --------- |
| Mikhail Panteleev | m.panteleev@innopolis.university | B23-SD-01 |
| Asqar Arslanov    | a.arslanov@innopolis.university  | B23-SD-01 |

---

## Social Blogging Site

...

### Build Instructions

...

```shell
docker compose up --build
```

### Acknowledgements

The SNA course mainly focuses on DevOps practices to maintain and deploy software applications rather than the arcitectural side of building software with code. For this reason, we&CloseCurlyQuote;ve decided not to reinvent the wheel and build upon an existing open source foundation.

The project idea is taken from the [RealWorld](https://realworld-docs.netlify.app/) project&mdash;a specification for a social blogging website used for (a) learning to build &OpenCurlyDoubleQuote;real world&CloseCurlyDoubleQuote;-size applications (b) demonstrating capabilities of new technologies.

The code for the back end has mostly been taken from [alpody/golang-fiber-realworld-example-app](https://github.com/alpody/golang-fiber-realworld-example-app). The front end code originates from [yukicountry/realworld-nextjs-rsc](https://github.com/yukicountry/realworld-nextjs-rsc). These implementations work well together (as all RealWorld implementations are supposed to).

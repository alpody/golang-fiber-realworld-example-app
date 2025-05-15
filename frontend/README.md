# Next.js + React Server Components implementation of RealWorld App

This codebase is frontend implementation of [RealWorld App](https://main--realworld-docs.netlify.app/) with Next.js App Router and React Server Components (RSC).

Sample implementation of fundamental features of web application, such as routing, CRUD operations, authentication, can be found here.

Any bug fixes or suggestions are welcome.

## Libraries and Frameworks

| Name                                          |                                    |
| --------------------------------------------- | ---------------------------------- |
| [TypeScript](https://www.typescriptlang.org/) | v5.5.x                             |
| [Next.js](https://nextjs.org/)                | v15.x                              |
| [React](https://react.dev/)                   | v18.x                              |
| [Conform](https://conform.guide/)             | form validation library            |
| [Zod](https://zod.dev/)                       | schema validation library          |
| [unified](https://unifiedjs.com/)             | markdown to html converter         |
| [OpenAPI TypeScript](https://openapi-ts.dev/) | type generator from OpenAPI schema |

## Getting Started

Demo app is running on <https://realworld-nextjs-rsc.vercel.app/> .

Alternatively, you can try it locally.

```bash
# copy env
cp .env.example .env.local

# set API_BASE_URL variable in .env.local to your backend api endpoint

# run app
npm run dev
```

## Directory structure

```plaintext
.
├── api/                  # api schema
├── public/               # static assets
└── src/
    ├── app/              # web routes
    ├── config/           # global configuration and constants
    ├── generated/        # automatically generated codes
    ├── modules/
    │   ├── common/       # common (feature-independent) components
    │   └── features/     # feature-specific components
    ├── styles/           # global style sheets
    └── utils/            # utilities
```

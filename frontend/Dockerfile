FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN if [ -d "dist" ]; then \
    mkdir -p /output && \
    cp -r dist/* /output/; \
    elif [ -d "build" ]; then \
    mkdir -p /output && \
    cp -r build/* /output/; \
    else \
    echo "No build output directory found" && \
    exit 1; \
    fi

FROM nginx:alpine

COPY --from=build /output /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

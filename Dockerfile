FROM nginx:alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Copy artifacts
WORKDIR /usr/share/nginx/html
COPY dist/sirh-employee-portal/ .
FROM node:16.13.1 as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
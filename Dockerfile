FROM node:argon

RUN mkdir /home/supjirallo

WORKDIR /home/supjirallo

COPY . /home/supjirallo

RUN cd /home/supjirallo && npm install 
RUN npm install -g bower
RUN cd /home/supjirallo && bower install --allow-root

EXPOSE 8080
EXPOSE 3000

CMD sleep 5s && node app.js


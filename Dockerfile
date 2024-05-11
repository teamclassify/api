FROM debian:latest

RUN dpkg --configure -a

ENV PYTHON_VERSION 3.7.7
ENV PYTHON_PIP_VERSION 20.1
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -y install nodejs npm

COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 8080
CMD ["npm", "run", "start"]
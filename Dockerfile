FROM node:14-alpine AS build1
WORKDIR /app
# see .dockerignore to know all copied files
ADD local /app/local
RUN cd /app/local && \
	npm install && \
    npm run build && \
	npm cache clean --force && \
	npm prune --production
COPY package.json /app/
RUN apk add --no-cache --virtual .build-deps make gcc g++ python bash git openssh && \
    npm install --production && \
	npm cache clean --force && \
	npm prune --production && \
	apk del --no-cache .build-deps



FROM golang:1.8.3-alpine3.6 as build2

# System setup
RUN apk update && apk add git curl build-base autoconf automake libtool

# Install protoc
ENV PROTOBUF_URL https://github.com/google/protobuf/releases/download/v3.3.0/protobuf-cpp-3.3.0.tar.gz
RUN curl -L -o /tmp/protobuf.tar.gz $PROTOBUF_URL
WORKDIR /tmp/
RUN tar xvzf protobuf.tar.gz
WORKDIR /tmp/protobuf-3.3.0
RUN mkdir /export
RUN ./autogen.sh && \
    ./configure --prefix=/export && \
    make -j 3 && \
    make check && \
    make install

# Install protoc-gen-go
RUN go get github.com/golang/protobuf/protoc-gen-go
RUN cp /go/bin/protoc-gen-go /export/bin/

# Export dependencies
RUN cp /usr/lib/libstdc++* /export/lib/
RUN cp /usr/lib/libgcc_s* /export/lib/



FROM node:14-alpine AS release
COPY --from=build1 /app /app
COPY --from=build2 /export /usr
RUN apk add --update-cache --no-cache \
	su-exec \
	bash \
	git \
	openssh \
	build-base \
	cmake \
	python3 \
	python3-dev \
	py3-pip \
	libgfortran \
	lapack-dev \
	openssl-dev \
	libffi-dev \
	ghostscript-dev \
	openblas-dev \
	ca-certificates
WORKDIR /app
COPY config.json crontab.js generate-dotenv.js gitsync gitsyncdir chmod-all chmod-one docker-entrypoint.sh /app/
ADD public /app/public
# To be compilant with
# - Debian/Ubuntu container (and so with ezmaster-webdav)
# - ezmaster see https://github.com/Inist-CNRS/ezmaster
RUN	echo '{ \
      "httpPort": 31976, \
      "configPath": "/app/config.json", \
      "dataPath": "/app/public" \
    }' > /etc/ezmaster.json && \
    sed -i -e "s/daemon:x:2:2/daemon:x:1:1/" /etc/passwd && \
    sed -i -e "s/daemon:x:2:/daemon:x:1:/" /etc/group && \
    sed -i -e "s/bin:x:1:1/bin:x:2:2/" /etc/passwd && \
    sed -i -e "s/bin:x:1:/bin:x:2:/" /etc/group && \
	pip3 install --no-cache-dir --upgrade pip
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD [ "npm", "start" ]

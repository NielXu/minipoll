#!/usr/bin/env bash

# This script will do the following job:
# 1. Pull mongo image if not exists
# 2. Start a container with mongo image, and remove it right after it stops

if [[ "$(docker images -q mongo 2> /dev/null)" == "" ]]; then
    docker pull mongo
fi

if [[ "$(docker ps -a | grep poll_database)" == "" ]]; then
    docker run --rm --name poll_database -d -p 27018:27017  mongo
    echo Mongo container[poll_database] started at port 27018
else
    echo Mongo container[poll_database] already running at port 27018
fi

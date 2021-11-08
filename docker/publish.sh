#!/bin/bash
set -e

docker build -f ./Dockerfile -t ngekaworu/user-center-umi ..;
docker push ngekaworu/user-center-umi;
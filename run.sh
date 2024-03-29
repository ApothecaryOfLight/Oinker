#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "http" ]];
then
  IP=$(curl ifconfig.me)
  echo "const ip = \"http://${IP}:3004\";" > ./frontend/ip_file.js
  cd backend && screen -d -m -S Oinker bash -c './run.sh http'
elif [[ "$1" = "https" ]];
then
  echo "const ip = \"https://oinker.xyz:3004\";" > ./frontend/ip_file.js
  cd backend && screen -d -m -S Oinker bash -c './run.sh https'
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run Oinker without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run Oinker with SSL/TSL Certificates.";
fi

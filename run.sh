#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "http" ]];
then
  IP=$(hostname -I | xargs)
  echo "const ip = \"ws://${IP}:3004\";" > ./frontend/ip_file.js
  cd backend && screen -d -m -S Oinker bash -c './run.sh http'
elif [[ "$1" = "https" ]];
then
  echo "const ip = \"wss://oinker.xyz:3004\";" > ./frontend/ip_file.js
  cd backend && screen -d -m -S Oinker bash -c './run.sh https'
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run Oinker without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run Oinker with SSL/TSL Certificates.";
fi

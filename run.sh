#!/bin/bash
if [[ "$1" = "dev" ]];
then
  IP=$(hostname -I | xargs)
  echo "const ip = \"ws://${IP}:3004\";" > ./frontend/ip_file.sh
elif [[ "$1" = "prod" ]];
then
  echo "const ip = \"wss://oinker.xyz:3004\";" > ./frontend/ip_file.sh
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run Oinker without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run Oinker with SSL/TSL Certificates.";
fi

cd backend && screen -d -m -S Oinker bash -c './run.sh "$1"'

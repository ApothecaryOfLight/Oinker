#!/bin/bash

#Bring Ubuntu up to date.
sudo apt-get upgrade -y && sudo apt-get update -y

#Install NodeJS
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

#Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

#Install Nginx
sudo apt-get install nginx -y
sudo ufw allow 'Nginx HTTP'
sudo ufw allow ssh
sudo ufw enable
cd /etc/nginx/sites-enabled && sudo sed -i "s/root \/var\/www\/html;/root \/home\/ubuntu\/frontend;/g" default
sudo systemctl restart nginx

#Install Certbot
sudo apt-get install certbot
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx
sudo ufw allow https

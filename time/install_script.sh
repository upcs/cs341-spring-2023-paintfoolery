#!/bin/bash
#
#Script for installing paintfoolery Proj

#run initial install
npm install

#install expo
npm install expo

#copy files into .expo directory
cp -r install_stuff/* .expo

#upgrade expo w/yes answers
yes | expo upgrade

#comment out database.js line
#sed -i '3s/^/\/\//' database-communication/database.js

#install datetimepicker
npm install datetimepicker --force

#run the server
npm start

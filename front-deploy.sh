#!/bin/sh

SCRIPT_DIR=$(cd $(dirname $0); pwd)
cd $SCRIPT_DIR
TARGET="/home/shjiima8/dist.zip"

mv $TARGET $SCRIPT_DIR
unzip $TARGET
rm -rf $TARGET
pm2 restart index.js

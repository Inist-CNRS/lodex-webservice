#!/bin/sh
mkdir -p /sbin/.npm /sbin/.config
chown -R daemon:daemon /app /tmp /sbin/.npm /sbin/.config
chmod 755 /app/public/expand.py
npm run watch &
exec su-exec daemon:daemon $*

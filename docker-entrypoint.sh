#!/bin/sh
mkdir -p /sbin/.npm /sbin/.config
chown -R daemon:daemon /app /tmp /sbin/.npm /sbin/.config
npm run watcher &
exec su-exec daemon:daemon $*

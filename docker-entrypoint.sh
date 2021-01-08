#!/bin/sh
mkdir -p /sbin/.npm /sbin/.config
chown -R daemon:daemon /app /tmp /sbin/.npm /sbin/.config
exec su-exec daemon:daemon $*

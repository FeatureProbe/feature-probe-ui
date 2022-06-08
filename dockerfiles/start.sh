#!/bin/bash

# configure nginx setting
mv /etc/nginx/conf.d/$env.conf.bak /etc/nginx/conf.d/feature-probe-ui.conf

# Start nginx
nginx

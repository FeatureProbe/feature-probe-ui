FROM hub.xiaojukeji.com/oe/oe_paas_nginx:20180524

MAINTAINER AlphaCloud: colewangqiang <colewangqiang@didiglobal.com>

RUN mkdir -p /workspace
COPY ./dockerfiles/start.sh /workspace/start.sh
COPY ./dockerfiles/webterminal.sh /workspace/webterminal.sh

# configure project nginx conf
COPY ./dockerfiles/nginx-conf /etc/nginx/conf.d/

COPY ./dockerfiles/start.conf /etc/supervisord.d/
COPY ./web /workspace/feature-probe-ui

EXPOSE 22 8080
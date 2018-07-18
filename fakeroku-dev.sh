#!/bin/bash

DIR="$( cd "$( dirname "$0" )" && pwd )"
BE_DIR="$DIR"
BE_COMPOSE="$BE_DIR/docker-compose.dev.yml"

be_preflight() {
    docker-compose -f "$BE_COMPOSE" build
}

be_up() {
    be_preflight
    docker-compose -f "$BE_COMPOSE" up
}

be_down() {
    docker-compose -f "$BE_COMPOSE" down
}

case "$1" in
    up)
        be_up
        ;;
    down)
        be_down
        ;;
    backend|be)
        case "$2" in
            up)
                be_up
                ;;
            down)
                be_down
                ;;
        esac
        ;;
esac

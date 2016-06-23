#!/bin/bash

green="\\033[1;32m"
red="\\033[1;31m"
basic="\\033[0;39m"

COMPOSER="docker run --rm --name composer -v $(pwd)/dev:/home/compose/composer -v ${HOME}/.composer:/home/compose/.composer --user 1000 registry.nexway.build/composer"

if [ -d dev ]
  then
    echo -e "$red Are you sure you want to execute the require tasks ?"
    echo -e "$red This will erase all the dev file. Make sure you didn't modify files in it."
    echo -e "$red [y/N] $basic"
    read -r -p "" response
    case $response in
        [yY][eE][sS]|[yY])
            rm -rf dev
            ;;
        *)
            echo -e "$green Dev will be preserve$basic"
            exit 0
            ;;
    esac
fi
#-b ESET-2061-whitelist-for-phpunit
git clone git@github.com:NexwayGroup/$1.git dev || git clone https://github.com/NexwayGroup/$1.git dev
# git checkout ESET-2061-whitelist-for-phpunit
# ${COMPOSER} && ${COMPOSER} require --dev phpunit/phpunit-selenium:2.*
make composer

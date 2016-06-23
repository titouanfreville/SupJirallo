#!/bin/bash

green="\\033[1;32m"
red="\\033[1;31m"
blue="\\033[1;34m"
basic="\\033[0;39m"
blue="\\033[1;34m"

check_file()
{
  local home="/home/httpd/softgallery"
  # Test if pass arguments is already a test case.
  # TRUE : execute phpunit and exit
  if [[ -f "${1}" ]]
  then
    ./vendor/bin/phpunit --colors=always ${1}
    exit 0;
  fi
  # Go into evry part of the folder to find any test case in it.
  for file in "${1}"/*
  do
    # echo "File : ${file}"
    if [[ -d "${file}" ]]
    then
      check_file ${file}
    elif [[ -f "${file}" ]]
    then
      is_test="${file:${#i}-12}"
      if [[ "${is_test}" = "AllTests.php" ]]
      then
        echo >> ${home}/logs/phpunit_errors.logs
        echo -en "$blue Test on ${file} : ------------------------------------------------\n"
        echo -en "$red If empty, search in logs ;) means that nothing was good here $basic\n"
        echo -en "$blue Test on ${file} : ------------------------------------------------ $basic\n" >> ${home}/logs/phpunit_errors.logs
        ./vendor/bin/phpunit --coverage-html ${home}/coverage
        ./vendor/bin/phpunit --colors=always ${file} 2>> ${home}/logs/phpunit_errors.logs
        echo -en "$blue DONE ------------------------------------------------------------- $basic\n" >> ${home}/logs/phpunit_errors.logs
        echo >> ${home}/logs/phpunit_errors.logs
        echo -en "$blue ------------------------------------------------------------------ $basic\n"
      fi
    fi
  done
}

echo -en "$blue UNIT TESTING ON THE `date` ----------------------------------------------- $basic\n"
echo -en "$blue UNIT TESTING ON THE `date` ----------------------------------------------- $basic\n" >> /home/httpd/softgallery/logs/phpunit_errors.logs
echo >> /home/httpd/softgallery/logs/phpunit_errors.logs
check_file ${1}

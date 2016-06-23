#!/bin/bash

green="\\033[1;32m"
red="\\033[1;31m"
basic="\\033[0;39m"
bblue="\\033[1;34m"
blue="\\033[0;34m"

source "scripts/wipthails.sh"
echo "InSide"
list=$1
echo $list
LIST="${list//\"}"
echo $LIST
read -r -a array <<< "$LIST"
for key in "${array[@]}"
do
  case "$key" in
    "PROJECT" )
      INPUT="$(init_inputbox "Update env_file" "PROJECT" "Enter project name" 16 40 $PROJECT)"
      sed -i 's|PROJECT=.*|PROJECT='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      PROJECT=$INPUT
      ;;
    "DEV_HOST" )
      INPUT="$(init_inputbox "Update env_file" "DEV_HOST" "Enter dev hostname" 16 40 $(hostname))"
      sed -i 's|DEV_HOST=.*|DEV_HOST='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      DEV_HOST=$INPUT
      ;;
    "DEV_IMG_CARROUSSEL" )
      INPUT="$(init_inputbox "Update env_file" "DEV_IMG_CARROUSSEL" "Enter absolute path to img carroussel. Empty if not needed" 16 40 $DEV_IMG_CARROUSSEL)"
      sed -i 's|DEV_IMG_CARROUSSEL=.*|DEV_IMG_CARROUSSEL='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      DEV_IMG_CARROUSSEL=$INPUT
      ;;
    "DEV_IMG_HOME" )
      INPUT="$(init_inputbox "Update env_file" "DEV_IMG_HOME" "Enter absolute path to img home. Empty if not needed" 16 40 $DEV_IMG_HOME)"
      sed -i 's|DEV_IMG_HOME=.*|DEV_IMG_HOME='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      DEV_IMG_HOME=$INPUT
      ;;
    "DEV_IMG_PICTO" )
      INPUT="$(init_inputbox "Update env_file" "DEV_IMG_PICTO" "Enter absolute path to img picto. Empty if not needed" 16 40 $DEV_IMG_PICTO)"
      sed -i 's|DEV_IMG_PICTO=.*|DEV_IMG_PICTO='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      DEV_IMG_PICTO=$INPUT
      ;;
    "DEV_IMG_PROD" )
      INPUT="$(init_inputbox "Update env_file" "DEV_IMG_PROD" "Enter absolute path to img prod. Empty if not needed" 16 40 $DEV_IMG_PROD)"
      sed -i 's|DEV_IMG_PROD=.*|DEV_IMG_PROD='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      DEV_IMG_PROD=$INPUT
      ;;
    "MYSQL_HOSTNAME" )
      INPUT="$(init_inputbox "Update env_file" "MYSQL_HOSTNAME" "Enter absolute path to img prod. Empty if not needed" 16 40 $MYSQL_HOSTNAME)"
      sed -i 's|MYSQL_HOSTNAME=.*|MYSQL_HOSTNAME='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      MYSQL_HOSTNAME=$INPUT
      ;;
    "MYSQL_USERNAME" )
      INPUT="$(init_inputbox "Update env_file" "MYSQL_USERNAME" "Enter absolute path to img prod. Empty if not needed" 16 40 $MYSQL_USERNAME)"
      sed -i 's|MYSQL_USERNAME=.*|MYSQL_USERNAME='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      MYSQL_USERNAME=$INPUT
      ;;
    "MYSQL_PASSWORD" )
      INPUT="$(init_inputbox "Update env_file" "MYSQL_PASSWORD" "Enter absolute path to img prod. Empty if not needed" 16 40 $MYSQL_PASSWORD)"
      sed -i 's|MYSQL_PASSWORD=.*|MYSQL_PASSWORD='"$INPUT"'|g' env_file && ERROR=0 || ERROR=1
      MYSQL_PASSWORD=$INPUT
      ;;
    "DB_SERVER_NAME" )
      source "scripts/wipthails.sh"
      i=0
      while read field
      do
        tmp=${field%_*}
        Duplicates+=("${tmp:-1}")
      done < \
      <(mysql -N -h 192.168.201.171 -u slave sgv3 --execute 'SELECT Name from Server where Templates_Server NOT LIKE "NULL";')
      NODUPLICATES=$(echo "${Duplicates[@]}" | tr ' ' '\n' | sort -u | tr '\n' ' ')
      OPTIONS=()
      i=0
      for na in ${NODUPLICATES[@]}
      do
        OPTIONS+=($(( i++ )) "$na")
      done
      CHOISE=$(init_select "Update env_file" "DB_SERVER_NAME" "Select the Server Name you need." $OPTIONS 20 80)
      SERVER=${OPTIONS[$[2*CHOISE+1]]}
      sed -i 's|DB_SERVER_NAME=.*|DB_SERVER_NAME='"$SERVER"'|g' env_file && ERROR=0 || ERROR=1
      ;;
     * )
       echo "finis"
       ;;
  esac
done

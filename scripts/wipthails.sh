#!/bin/bash
init_select()
{
  spe_lang="fr"
  if [ $# -lt 4 ]
    then
      echo -n "Illegal number of parameters, you broke me :'( "
      echo "-- usage: init_select BACKTITLE TITLE QUESTION OPTIONS (HEIGHT) (WIDTH) (SPACE_BEFORE_OPTION)"
      return 1
  fi
  eval `resize`
  SPACE=10
  if [ $# -ge 5 ]
    then LINES=$5
  fi
  if [ $# -ge 6 ]
    then COLUMNS=$6
  fi
  if [ $# -ge 7 ]
    then SPACE=$7
  fi
  BACKTITLE="$1"
  TITLE="$2"
  MENU="$3"
  OPTIONS=$4
  whiptail --clear \
    --backtitle "$BACKTITLE" \
    --title "$TITLE" \
    --menu "$MENU" \
    $LINES $COLUMNS $(( $LINES - $SPACE )) \
    "${OPTIONS[@]}" \
    2>&1 >/dev/tty
}

init_inputbox()
{
  if [ $# -lt 3 ]
    then
      echo -n "Illegal number of parameters, you broke me :'( "
      echo "-- usage: init_select BACKTITLE TITLE QUESTION (HEIGHT) (WIDTH) (DEFAULT_TEXT)"
      return 1
  fi
  eval `resize`
  TEXT=""
  if [ $# -ge 4 ]
    then LINES=$4
  fi
  if [ $# -ge 5 ]
    then COLUMNS=$5
  fi
  if [ $# -ge 6 ]
    then TEXT=$6
  fi
  BACKTITLE="$1"
  TITLE="$2"
  MENU="$3"
  whiptail --clear \
    --backtitle "$BACKTITLE" \
    --title "$TITLE" \
    --inputbox "$MENU" \
    $LINES $COLUMNS $TEXT\
    2>&1 >/dev/tty
}

init_checklist()
{
  # ### ### ### BEFORE OPERING ### ### ### #

  if [ $# -lt 4 ]
    then
      echo -n "Illegal number of parameters, you broke me :'( "
      echo "-- usage: init_select BACKTITLE TITLE QUESTION ENV_FILE (HEIGHT) (WIDTH) (SPACE_BEFORE_OPTION)"
      return 1
  fi
  eval `resize`
  . env_file
  SPACE=10
  BACKTITLE="$1"
  TITLE="$2"
  MENU="$3"
  whiptail --clear \
    --backtitle "$BACKTITLE" \
    --title "$TITLE" \
    --checklist "$MENU" \
    $LINES $COLUMNS $(( $LINES - $SPACE )) \
    "PROJECT" "$PROJECT" ON \
    "DEV_HOST" "$DEV_HOST" ON \
    "DEV_IMG_CARROUSSEL" "$DEV_IMG_CARROUSSEL" OFF \
    "DEV_IMG_HOME" "$DEV_IMG_HOME" OFF \
    "DEV_IMG_PICTO" "$DEV_IMG_PICTO" OFF \
    "DEV_IMG_PROD" "$DEV_IMG_PROD" OFF \
    "DB_SERVER_NAME" "$DB_SERVER_NAME" OFF \
    "MYSQL_HOSTNAME" "$MYSQL_HOSTNAME" OFF \
    "MYSQL_USERNAME" "$MYSQL_USERNAME" OFF \
    "MYSQL_PASSWORD" "$MYSQL_PASSWORD" OFF \
    2>&1 >/dev/tty
}

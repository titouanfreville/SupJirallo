#!/bin/bash
# Local Variables --------------------------------------------------------------
RETURN_CODE=0
FRC=0
DB_VAR=0
CONFIG_CLASS=0
ENV=0
# ### COLORS ### #
green="\\033[1;32m"
red="\\033[1;31m"
basic="\\033[0;39m"
blue="\\033[1;34m"
# ### ### #
# ------------------------------------------------------------------------------
echo -e "Making a basic set up ----------------------------------------------------"
# Copy -------------------------------------------------------------------------
echo -e
echo -e "COPY #####################################################################"
# env_file ---------------------------------------------------------------------
echo -e "$blue Copying env_file.dist into env_file.$basic"

if [[ -f env_file ]]
then
  echo -e "$blue env_file alreay exist. Do you want to overwrite it ?"
  echo -e "$blue [Y/n] $basic"
  read -r -p "" response
  case $response in
       [nN][oO]|[nN])
         echo -e "$green The file will not be overwrite. Hope you had made it well ;) $basic"
         ENV=1
         ;;
      *)
        echo -e "$red The file is going to be overwrite with the defaul config. Are you sure ? [sleep 10s] to Ctrl+C$basic"
        sleep 10s
        cp -f env_file.dist env_file
        ;;
  esac
else
  cp -f env_file.dist env_file
fi

if [ $? -eq 0 ]
then
  echo -e "$green DONE$basic"
else
  echo -e "$red FAILED TO COPY env_file.dist as env_file $basic"
  echo -e "$basic"
  FRC=$[$FRC+1]
fi
echo
# ------------------------------------------------------------------------------
# rabbit.json ------------------------------------------------------------------
echo -e "$blue Copying rabbit.json.dist as rabbit.json.$basic"

if [[ -f rabbit.json ]]
then
  echo -e "$blue rabbit.json alreay exist. Do you want to overwrite it ?"
  echo -e "$blue [Y/n] $basic"
  read -r -p "" response
  case $response in
       [nN][oO]|[nN])
         echo -e "$green The file will not be overwrite. Hope you had made it well ;) $basic"
         ENV=1
         ;;
      *)
        echo -e "$red The file is going to be overwrite with the defaul config. Are you sure ? [sleep 10s] to Ctrl+C$basic"
        sleep 10s
        cp -f rabbit.json.dist rabbit.json
        ;;
  esac
else
  cp -f rabbit.json.dist rabbit.json
fi

if [ $? -eq 0 ]
then
  echo -e "$green DONE$basic"
else
  echo -e "$red FAILED TO COPY rabbit.json.dist as rabbit.json $basic"
  echo -e "$basic"
  FRC=$[$FRC+1]
fi
echo
# ------------------------------------------------------------------------------
# Copy docker/dbvar.inc.dist ---------------------------------------------------
echo -e "$blue Copying docker/dbvar.inc.dist into include.$basic"

if [[ -f dev/include/dbvar.inc ]]
then
  echo -e "$blue dev/include/dbvar.inc alreay exist. Do you want to overwrite it ?"
  echo -e "$blue [Y/n] $basic"
  read -r -p "" response
  case $response in
       [nN][oO]|[nN])
         echo -e "$green The file will not be overwrite. Setup will be skipped for it.$basic"
         DB_VAR=1
         ;;
      *)
        echo -e "$red The file is going to be overwrite with a new config. Are you sure ? [sleep 10s] to Ctrl+C$basic"
        sleep 10s
        cp -f docker/dbvar.inc.dist dev/include/dbvar.inc
        ;;
  esac
else
  cp -f docker/dbvar.inc.dist dev/include/dbvar.inc
fi

if [ $? -eq 0 ]
then
  echo -e "$green DONE$basic"
else
  echo -e "$red FAILED TO COPY docker/dbvar.inc.dist dev/include/dbvar.inc $basic"
  echo -e "$basic"
  FRC=$[$FRC+1]
fi
echo
# ------------------------------------------------------------------------------
# Copy code/secureCustomer/Config.class.php.dev --------------------------------
echo -e "$blue Copying code/secureCustomer/Config.class.php.dev into code/secureCustomer/Config.class.php.$basic"

if [[ -fdev/code/secureCustomer/Config.class.php ]]
then
  echo -e "$blue dev/code/secureCustomer/Config.class.php alreay exist. Do you want to overwrite it ?"
  echo -e "$blue [Y/n] $basic"
  read -r -p "" response
  case $response in
       [nN][oO]|[nN])
         echo -e "$green The file will not be overwrite. Setup will be skipped for it.$basic"
         CONFIG_CLASS=1
         ;;
      *)
        echo -e "$red The file is going to be overwrite with a new config. Are you sure ? [sleep 10s] to Ctrl+C$basic"
        sleep 10s
        cp -f dev/code/secureCustomer/Config.class.php.dev dev/code/secureCustomer/Config.class.php
        ;;
  esac
else
  cp -f dev/code/secureCustomer/Config.class.php.dev dev/code/secureCustomer/Config.class.php
fi

if [ $? -eq 0 ]
then
  echo -e "$green DONE$basic"
else
  echo -e "$red FAILED TO COPY code/secureCustomer/Config.class.php.dev$basic"
  echo -e "$basic"
  FRC=$[$FRC+1]
fi
echo
# ------------------------------------------------------------------------------
if [ $FRC  -eq 0 ]
then
  echo -e "$green Copy are dones.$basic"
else
  echo -e "$red $FRC copy failed, correct them before next steps$basic"
  echo -e "##########################################################################"
  exit 1
fi
echo -e "##########################################################################"
echo -e "$basic"
# ------------------------------------------------------------------------------
FRC=0
# Seding basics ----------------------------------------------------------------
echo -e "Setting ##################################################################"
# Setting up env_file ----------------------------------------------------------
if [ $ENV -eq 0 ]
then
  echo -e "$blue Setting up env_file$basic"

  sed -i "s/__BASEUID__/$UID/g" env_file
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__DEVHOST__/$(hostname)/g" env_file
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  ###### RETURN ERRORS OR DONT
  if [ $RETURN_CODE -eq 0 ]
  then
    echo -e "$green env_file Setted"
  else
    echo -e "$red Failed to set env_file"
    FRC=$[$FRC+1]
  fi

  echo -e "$basic"
fi
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting up 4 ------------------------------------------
echo -e "$red Do you want to replace async.message.config by default configuration (docker/async.message.config.dist) ?"
echo -e "$red [Y/n] $basic"
read -r -p "" response
case $response in
     [nN][oO]|[nN])
       echo -e "$green Setup conserved.$basic"
       RETURN_CODE=0
       ;;
    *)
      echo -e "$red The file is going to be overwrite with a new config. Are you sure ? [sleep 10s] to Ctrl+C$basic"
      sleep 10s
      cp -f docker/async.message.config.dist dev/config/async.message.config && RETURN_CODE=0 || RETURN_CODE=1
      ;;
esac
###### RETURN ERRORS OR DONT
if [ $RETURN_CODE -eq 0 ]
then
  echo -e "$green async.message.config.dist Setted"
else
  echo -e "$red async.message.config.dist"
  FRC=$[$FRC+1]
fi
echo -e "$basic"
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting up code/secureCustomer/Config.class.php ------------------------------
if [ $CONFIG_CLASS -eq 0 ]
then
  echo -e "$blue Setting up code/secureCustomer/Config.class.php$basic"

  sed -i "s/__MYSQL_USERNAME__/$MYSQL_USERNAME/" dev/code/secureCustomer/Config.class.php
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_HOSTNAME__/$MYSQL_HOSTNAME/" dev/code/secureCustomer/Config.class.php
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_PASSWORD__/$MYSQL_PASSWORD/" dev/code/secureCustomer/Config.class.php
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  ###### RETURN ERRORS OR DONT
  if [ $RETURN_CODE -eq 0 ]
  then
    echo -e "$green code/secureCustomer/Config.class.php Setted"
  else
    echo -e "$red Failed to set code/secureCustomer/Config.class.php"
    FRC=$[$FRC+1]
  fi

  echo -e "$basic"
fi
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting include/dbvar.inc ----------------------------------------------------
if [ $DB_VAR -eq 0 ]
then
  echo -e "$blue Setting up include/dbvar.inc$basic"

  sed -i "s/__MYSQL_USERNAME__/$MYSQL_USERNAME/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_HOSTNAME__/$MYSQL_HOSTNAME/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi
  sed -i "s/__MYSQL_PASSWORD__/$MYSQL_PASSWORD/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_USERNAME_SESSION__/$MYSQL_USERNAME/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_HOSTNAME_SESSION__/$MYSQL_HOSTNAME/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_PASSWORD_SESSION__/$MYSQL_PASSWORD/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  sed -i "s/__MYSQL_HOSTNAME_RO__/$MYSQL_HOSTNAME/" dev/include/dbvar.inc
  if [ $? -ne 0 ]
  then
    RETURN_CODE=1
  fi

  ###### RETURN ERRORS OR DONE
  if [ $RETURN_CODE -eq 0 ]
  then
    echo -e "$green include/dbvar.inc Setted"
  else
    echo -e "$red Failed to set include/dbvar.inc"
    FRC=$[$FRC+1]
  fi
fi
echo -e "$basic"
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting include/TfrCacheManager.class.php ------------------------------------
echo -e "$blue Setting up include/TfrCacheManager.class.php$basic"

sed -i "s/prep2\.telechargement\.fr/memcached/g" dev/include/TfrCacheManager.class.php
if [ $? -ne 0 ]
then
  RETURN_CODE=1
fi

###### RETURN ERRORS OR DONT
if [ $RETURN_CODE -eq 0 ]
then
  echo -e "$green include/TfrCacheManager.class.php Setted"
else
  echo -e "$red Failed to set include/TfrCacheManager.class.php"
  FRC=$[$FRC+1]
fi
echo -e "$basic"
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting tests/include/Order/*.php --------------------------------------------
echo -e "$blue Setting up tests/include/Order$basic"

FULL_HOSTNAME="$HOSTNAME.telechargement.fr"
sed -i "s/\.prep\.websizing\.com/.$FULL_HOSTNAME/g" dev/tests/include/Order/*.php
if [ $? -ne 0 ]
then
  RETURN_CODE=1
fi

###### RETURN ERRORS OR DONT
if [ $RETURN_CODE -eq 0 ]
then
  echo -e "$green tests/include/Order Setted"
else
  echo -e "$red Failed to set tests/include/Order"
  FRC=$[$FRC+1]
fi

echo -e "$basic"
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting tests/include/Order/BaseTestCase.class.php ---------------------------
echo -e "$blue Setting up tests/include/Order/BaseTestCase.class.php$basic"

sed -i "s/127\.0\.0\.1/selenium/g" dev/tests/include/Order/BaseTestCase.class.php
if [ $? -ne 0 ]
then
  RETURN_CODE=1
fi
sed -i "s/\.prep\.websizing\.com/.$FULL_HOSTNAME/g" dev/tests/include/Order/BaseTestCase.class.php
if [ $? -ne 0 ]
then
  RETURN_CODE=1
fi

###### RETURN ERRORS OR DONE
if [ $RETURN_CODE -eq 0 ]
then
  echo -e "$green tests/include/Order/BaseTestCase.class.php Setted"
else
  echo -e "$red Failed to set tests/include/Order/BaseTestCase.class.php"
  FRC=$[$FRC+1]
fi

echo -e "$basic"
# ------------------------------------------------------------------------------
RETURN_CODE=0
# Setting include/auto_prepend_file.inc ----------------------------------
echo -e "$blue Setting up include/auto_prepend_file.inc$basic"

sed -i "s/prepgraylog/appradar/g" dev/include/auto_prepend_file.inc
if [ $? -ne 0 ]
then
  RETURN_CODE=1
fi

###### RETURN ERRORS OR DONE
if [ $RETURN_CODE -eq 0 ]
then
  echo -e "$green include/auto_prepend_file.inc Setted"
else
  echo -e "$red Failed to set include/auto_prepend_file.inc"
  FRC=$[$FRC+1]
fi
# ------------------------------------------------------------------------------
echo -e "$basic"
# End Return -------------------------------------------------------------------
if [ $FRC  -eq 0 ]
then
  echo -e "$green Setting up according to env.$basic"
else
  echo -e "$red Setting failed, correct the $FRC issues before next steps$basic"
  echo -e "##########################################################################"
  exit 1
fi
echo -e "##########################################################################"
# ------------------------------------------------------------------------------

echo -e "$basic"
exit 0

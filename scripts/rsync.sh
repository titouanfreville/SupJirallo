#!/bin/bash

# Spinner ----------------------------------------------------------------------
red="\\033[1;31m"
basic="\\033[0;39m"
source ../env_file

if [ -z "$RSYNC_MYSQL_HOSTNAME" ] || [ -z "$RSYNC_MYSQL_USER" ] || [ -z "$RSYNC_MYSQL_DATABASE" ] || [ -z "$DB_SERVER_NAME" ]
    then 
        echo -e "$red A small devil passed here and erase your ENV_FILE, please checl and correct it :O $basic"
        echo "Script exited with error code: 666"
        exit 666
fi

query="SELECT Templates_Server from Server where name like '${DB_SERVER_NAME}%' and Templates_Server NOT LIKE 'NULL';"

source "$(pwd)/spinner.sh"

function start_spinner {
    # $1 : msg to display
    echo >> $2/rsync.logs
    echo "$1 -----------------------------------------" >> $2/rsync.logs
    echo >> $2/rsync_errors.logs
    echo "$1 -----------------------------------------" >> $2/rsync_errors.logs
    _spinner "start" "${1}" &
    # set global spinner pid
    _sp_pid=$!
    disown
}

function stop_spinner {
    echo "End $2 -------------------------------------" >> $3/rsync.logs
    echo "End $2 -------------------------------------" >> $3/rsync_errors.logs
    # $1 : command exit status
    _spinner "stop" $1 $_sp_pid
    unset _sp_pid
}

# ------------------------------------------------------------------------------

# Rsyncs -----------------------------------------------------------------------

RSYNC_IP=192.168.200.254

echo " -------------------------------------- " >> $3/rsync.logs
echo " -------------------------------------- " >> $3/rsync_errors.logs
date >> $3/rsync.logs
date >> $3/rsync_errors.logs

if [ -z "$RSYNC_MYSQL_PASSWORD"]
    then
        res=$(mysql -N -h $RSYNC_MYSQL_HOSTNAME -u $RSYNC_MYSQL_USER $RSYNC_MYSQL_DATABASE --execute "$query")
    else 
        res=$(mysql -N -h $RSYNC_MYSQL_HOSTNAME -u $RSYNC_MYSQL_USER -p$RSYNC_MYSQL_PASSWORD $RSYNC_MYSQL_DATABASE --execute "$query")
fi

echo > $3/rsync.logs
for ids in $res
do
    #Rsync private ----------------------------------------------
    start_spinner "rsync $ids templates" $3
    rsync --delete -avzpog -e ssh $1@$RSYNC_IP:/home/httpd/softgallery/private/templates/$ids* $2/temp_test  >> $3/rsync.logs 2>> $3/rsync_errors.logs
    stop_spinner $? "rsync $ids templates" $3
    # -----------------------------------------------------------
done
    
#Rsync common  ----------------------------------------------

start_spinner "rsync 629 templates" $3
rsync --delete -avzpog -e ssh $1@$RSYNC_IP:/home/httpd/softgallery/private/templates/629* $2/temp_test  >> $3/rsync.logs 2>> $3/rsync_errors.logs
start_spinner "rsync 724 templates" $3
rsync --delete -avzpog -e ssh $1@$RSYNC_IP:/home/httpd/softgallery/private/templates/724* $2/temp_test  >> $3/rsync.logs 2>> $3/rsync_errors.logs
stop_spinner $? "rsync 724 templates" $3
echo " -------------------------------------- " >> $3/rsync_errors.logs
# sudo chown $whoami:$whoami $2

#!/bin/bash
# Local Variables --------------------------------------------------------------
# ### COLORS ### #
green="\\033[1;32m"
red="\\033[1;31m"
basic="\\033[0;39m"
blue="\\033[1;34m"
# ### ### #
# ------------------------------------------------------------------------------
# Check if 0.0.0.0:80 is free --------------------------------------------------
echo -e "$blue Checking if 0.0.0.0:3000 is free ... $basic"
sudo netstat -tlnp |grep :3000
if [ $? -eq 0 ]
then
  echo -e "$red Please shut the process running.$basic"
  exit 1
else
  echo -e "$green You are Ok ;)$basic"
fi
echo
# ------------------------------------------------------------------------------

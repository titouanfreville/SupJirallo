#!/bin/bash

src=$1
dest=$2

echo "Mode de Compilation : Debug(d) ou Production(P)"

read mode

case "$mode" in
  d) compass watch --sass-dir $src --force -s expand $dest;;
  *) compass watch --sass-dir $src --force -s compressed --no-line-comments $dest;;
esac;

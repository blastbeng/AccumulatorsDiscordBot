#!/bin/sh
params=$1
outfile=$2
/usr/bin/curl -X 'GET' '$params' -H 'accept: */*' --output '$outfile'
#!/bin/sh
params=$1
/usr/bin/curl -X 'GET' 'http://192.168.1.160:5500/api/tts?voice=marytts%3Aistc-lucia-hsmm&text=andate%20a%20fanculo%20stronzi%20luridi%20accumulatori&vocoder=high&denoiserStrength=0.03&cache=false'   -H 'accept: */*' --output /ramdisk/prova.wav
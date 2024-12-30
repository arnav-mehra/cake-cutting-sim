eval "g++ -I ~/Downloads/eigen-3.4.0/eigen-3.4.0/ -O3 -std=c++17 $1.cpp -o $1"
TIMEFORMAT=$'\nExecution time: %Rs'
eval "time ./$1"
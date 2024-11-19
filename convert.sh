#!/bin/bash

dir=$1

source=src/${dir}
destination=${dir}

mkdir -p ${destination}
counter=1

for file in $(ls $source/[0-9][0-9][0-9][0-9].jpeg | sort -V); do
    base_name=$(basename $file)
    digits=${base_name:0:4}

    # process image
    image_filename=$(printf "%04d.avif" $counter)

    convert $file -resize 1024x1024\> -gravity center -background black -extent 1024x1024 jpeg:temp.jpeg
    avifenc --speed 1 temp.jpeg ${destination}/${image_filename}

    # process text
    text_filename=${digits}.txt
    touch ${source}/${text_filename}
    cp ${source}/${text_filename} ${destination}/$(printf "%04d.txt" $counter)

    # go to next
    counter=$((counter + 1))
done

cp ${source}/meta.json ${destination}/meta.json

rm temp.jpeg

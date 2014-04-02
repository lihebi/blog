#!/bin/bash

POSTS=`ls _posts/* | grep '-' && echo 'exit'`
echo "Publish witch file?"

select opt in $POSTS; do
	if [ $opt == 'exit' ]; then
		exit 0;
	fi

        vim $opt;
done

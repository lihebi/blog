#!/bin/bash

POSTS=`ls _drafts/* | grep '-' && echo 'exit'`
echo "Publish witch file?"

select opt in $POSTS; do
	if [ $opt == 'exit' ]; then
		exit 0;
	fi

	NEWT=`date +%Y-%m-%d`-`grep -P '^title: (.+)$' $opt | tr "[:upper:]" "[:lower:]" | sed 's/^title: //' | sed 's/ /-/g' | sed 's/[^A-Za-z0-9\-]//g'`
	NEWT="_posts/$NEWT.md"
	echo "Publishing: $opt."
	echo "git mv $opt $NEWT"
	git mv $opt $NEWT
done

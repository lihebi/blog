#J=bundle exec jekyll
J=jekyll

all: site

site: clean
	$J build #--lsi
	chmod -R a+rx ./_site/

clean:
	rm -rf _site/

local:
	$J serve --port=4567 --watch --drafts

new:
	./new_post.sh

modify:
	./modify.sh

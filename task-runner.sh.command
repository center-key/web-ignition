#!/bin/bash
###############
# Task Runner #
###############

# To make this file runnable:
#     $ chmod +x *.sh.command

banner="web-ignition"
projectHome=$(cd $(dirname $0); pwd)
apacheCfg=/usr/local/etc/httpd
apacheLog=/usr/local/var/log/httpd/error_log
webDocRoot=$(grep ^DocumentRoot $apacheCfg/httpd.conf | awk -F'"' '{ print $2 }')

setupTools() {
   cd $projectHome
   echo
   echo $banner
   echo $(echo $banner | sed s/./=/g)
   pwd
   test -d .git || { echo "Project must be in a git repository."; exit; }
   git restore dist/* &>/dev/null
   git pull --ff-only
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   npm install --no-fund
   npm update --no-fund
   npm outdated
   echo
   }

releaseInstructions() {
   cd $projectHome
   repository=$(grep repository package.json | awk -F'"' '{print $4}' | sed s/github://)
   package=https://raw.githubusercontent.com/$repository/main/package.json
   version=v$(grep '"version"' package.json | awk -F'"' '{print $4}')
   pushed=v$(curl --silent $package | grep '"version":' | awk -F'"' '{print $4}')
   minorVersion=$(echo ${pushed:1} | awk -F"." '{ print $1 "." $2 }')
   released=$(git tag | tail -1)
   published=v$(npm view $repository version)
   test $? -ne 0 && echo "NOTE: Ignore error if package is not yet published."
   echo "Local changes:"
   git status --short
   echo
   echo "Recent releases:"
   git tag | tail -5
   echo
   echo "Release progress:"
   echo "   $version (local) --> $pushed (pushed) --> $released (released) --> $published (published)"
   echo
   test "$version" ">" "$released" && mode="NOT released" || mode="RELEASED"
   echo "Current version is: $mode"
   echo
   nextActionBump() {
      echo "When ready to do the next release:"
      echo
      echo "   === Increment version ==="
      echo "   Edit pacakge.json to bump $version to next version number"
      echo "   $projectHome/package.json"
      }
   nextActionCommitTagPub() {
      echo "Verify all tests pass and then finalize the release:"
      echo
      echo "   === Commit and push ==="
      echo "   Check in all changed files with the message:"
      echo "   Release $version"
      echo
      echo "   === Tag and publish ==="
      echo "   cd $projectHome"
      echo "   git tag --annotate --message 'Release' $version"
      echo "   git remote --verbose"
      echo "   git push origin --tags"
      echo "   npm publish"
      }
   test "$version" ">" "$released" && nextActionCommitTagPub || nextActionBump
   echo
   }

updateCdnVersion() {
   cd $projectHome
   echo "Update CDN version:"
   updateVersion="s|web-ignition@[.0-9]*|web-ignition@$minorVersion|"
   sed -i "" $updateVersion README.md
   find src/css -name "*.html"
   find src/css -name "*.html" | xargs sed -i "" $updateVersion
   echo
   }

runSpecs() {
   cd $projectHome
   echo "Run specifications:"
   npm test
   echo
   }


customizeBlogger() {
   cd $projectHome
   sed \
      -e "s|.SHORT-BLOG-NAME.|One of Dem Blogs|g" \
      -e "s|.BOOKMARK-URL.|https://centerkey.com/graphics/bookmark.png|g" \
      -e "s|.MOBILE-HOME-SCREEN-URL.|https://centerkey.com/graphics/mobile-home-screen.png|g" \
      -e "s|.AUTHORS-URL.|https://centerkey.com/dem|g" \
      -e "s|.TWITTER-USERNAME.|DemPilafian|g" \
      dist/blogger-tweaks.min.css > build/blogger-tweaks-custom.css
   pwd
   ls -lo build/blogger-tweaks-custom.css
   echo
   }

publishWebFiles() {
   # spec-js.html:
   #     <link rel=stylesheet href=../../dist/reset.min.css>
   #     <script defer src=../../dist/lib-x.min.js></script>
   #     <img src=../css/layouts/neon/ameba-cdcgov.jpg alt=montage>
   # layouts.html:
   #     <a href=layouts/block-duo.css>block-duo.css</a>
   # layouts/*.html:
   #     <link rel=stylesheet href=../../../dist/reset.min.css>
   #     <link rel=stylesheet href=neon.css>
   #     <script defer src=neon.js></script>
   cd $projectHome
   publishSite=$webDocRoot/centerkey.com
   publishFolder=$publishSite/web-ignition
   cdnBase=https://cdn.jsdelivr.net/npm/web-ignition@$minorVersion/dist
   githubLayouts=https://github.com/center-key/web-ignition/blob/main/css/layouts
   publish() {
      echo "Publishing:"
      echo $publishFolder
      mkdir -p $publishFolder/layouts
      cp -v src/css/*.html src/js/*.html     $publishFolder
      cp -v src/css/layouts/*.html           $publishFolder/layouts
      cp -v src/css/blogger-tweaks/spec.html $publishFolder/blogger-tweaks.html
      sed -E -i "" "s#[./]+/dist#$cdnBase#g"                               $publishFolder/spec-*.html
      sed -E -i "" "s#[./]+/css#$cdnBase#g"                                $publishFolder/spec-*.html
      sed -E -i "" "s#layouts/([a-z-]*)[.]css#$githubLayouts/\1.css#g"     $publishFolder/layouts.html
      sed -E -i "" "s#[./]+/dist#$cdnBase#g"                               $publishFolder/layouts/*.html
      sed -E -i "" "s#href=([a-z-]*)[.]css#href=$cdnBase/layouts/\1.css#g" $publishFolder/layouts/*.html
      sed -E -i "" "s#src=([a-z-]*)[.]js#src=$cdnBase/layouts/\1.min.js#g" $publishFolder/layouts/*.html
      sed -E -i "" "s#[./]+/dist#$cdnBase#g"                               $publishFolder/blogger-tweaks.html
      test -x "$(which tree)" && tree $publishFolder
      ls -o $publishFolder
      echo "Published -> ${publishFolder/$webDocRoot/http//:localhost}"
      echo
      }
   test -w $publishSite && publish
   }

openWebPage() {
   cd $projectHome
   echo "Opening:"
   echo "   src/css/spec-css.html"
   echo "   src/js/spec-js.html"
   echo "   src/css/layouts.html"
   sleep 2
   open src/css/spec-css.html
   open src/js/spec-js.html
   open src/css/layouts.html
   echo
   }

setupTools
releaseInstructions
updateCdnVersion
runSpecs
customizeBlogger
publishWebFiles
openWebPage

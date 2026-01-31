#!/bin/bash
###############
# Task Runner #
###############

# To make this file runnable:
#     $ chmod +x *.sh.command

banner="web-ignition"
projectHome=$(cd $(dirname $0); pwd)
pkgInstallHome=$(dirname $(dirname $(which httpd)))
apacheCfg=$pkgInstallHome/etc/httpd
apacheLog=$pkgInstallHome/var/log/httpd/error_log
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
   org=$(grep git+https package.json | awk -F'/' '{print $4}')
   name=$(grep '"name":' package.json | awk -F'"' '{print $4}')
   package=https://raw.githubusercontent.com/$org/$name/main/package.json
   version=v$(grep '"version"' package.json | awk -F'"' '{print $4}')
   pushed=v$(curl --silent $package | grep '"version":' | awk -F'"' '{print $4}')
   minorVersion=$(echo ${pushed:1} | awk -F"." '{ print $1 "." $2 }')
   released=$(git tag | tail -1)
   published=v$(npm view $name version)
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
      echo "   Edit package.json to bump $version to next version number"
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
      echo "   git config user.name"
      echo "   git tag --annotate $version --message 'Release'"
      echo "   git remote --verbose"
      echo "   git push origin --tags"
      echo "   npm whoami"
      echo "   npm publish"
      }
   test "$version" ">" "$released" && nextActionCommitTagPub || nextActionBump
   echo
   }

updateCdnVersion() {
   cd $projectHome
   echo "Update CDN version:"
   updateVersion="s|web-ignition@[.0-9]*|web-ignition@$minorVersion|"
   ls                       README.md
   sed -i "" $updateVersion README.md
   find spec            -name "spec-*.html"
   find src/css/layouts -name "*.html"
   find spec            -name "spec-*.html" | xargs sed -i "" $updateVersion
   find src/css/layouts -name "*.html" |      xargs sed -i "" $updateVersion
   echo
   }

runSpecs() {
   cd $projectHome
   echo "Run specifications:"
   npm test
   echo
   }

randomPages() {
   cd $projectHome
   npm run random-pages
   }

customizeBlogger() {
   cd $projectHome
   sed \
      -e "s|.SHORT-BLOG-NAME.|pilafmon blog|g" \
      -e "s|.BOOKMARK-URL.|https://centerkey.com/graphics/bookmark-icon.png|g" \
      -e "s|.MOBILE-HOME-SCREEN-URL.|https://centerkey.com/graphics/mobile-home-screen.png|g" \
      -e "s|.AUTHORS-URL.|https://centerkey.com/pilaf|g" \
      -e "s|.TWITTER-USERNAME.|pilafmon|g" \
      dist/blogger-tweaks.min.css > build/blogger-tweaks-custom.css
   pwd
   ls -o build/blogger-tweaks-custom.css
   echo
   }

publishWebFiles() {
   # spec-js.html:
   #     <link rel=stylesheet href=../dist/reset.min.css>
   #     <script defer src=../dist/lib-x.min.js></script>
   #     <span data-img-src=../src/css/layouts/neon/ameba-cdcgov.jpg>
   # spec-layouts.html:
   #     <a href=../src/css/layouts/block-duo.css>block-duo.css</a>
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
      mkdir -pv $publishFolder/layouts
      cp -v spec/spec-*.html       $publishFolder
      cp -v src/css/layouts/*.html $publishFolder/layouts
      sed -E -i "" "s#[./]+/dist#$cdnBase#g"                               $publishFolder/spec-*.html
      sed -E -i "" "s#[./]+/css#$cdnBase#g"                                $publishFolder/spec-*.html
      sed -E -i "" "s#../src/css/layouts/([a-z-]*)[.]css#$githubLayouts/\1.css#g" $publishFolder/spec-layouts.html
      sed -E -i "" "s#[./]+/dist#$cdnBase#g"                               $publishFolder/layouts/*.html
      sed -E -i "" "s#href=([a-z-]*)[.]css#href=$cdnBase/layouts/\1.css#g" $publishFolder/layouts/*.html
      sed -E -i "" "s#src=([a-z-]*)[.]js#src=$cdnBase/layouts/\1.min.js#g" $publishFolder/layouts/*.html
      test -x "$(which tree)" && tree $publishFolder
      ls -o $publishFolder
      echo "Published -> ${publishFolder/$webDocRoot/http://localhost}"
      echo
      }
   test -w $publishSite && publish
   }

openWebPage() {
   cd $projectHome
   echo "To validate HTML:"
   echo "   npm run validate-html"
   echo
   echo "Opening:"
   echo "   spec/spec-css.html"
   echo "   spec/spec-js.html"
   echo "   spec/spec-video.html"
   echo "   spec/spec-layouts.html"
   sleep 2
   open spec/spec-css.html
   open spec/spec-js.html
   open spec/spec-video.html
   open spec/spec-layouts.html
   echo
   }

setupTools
releaseInstructions
updateCdnVersion
runSpecs
customizeBlogger
publishWebFiles
openWebPage

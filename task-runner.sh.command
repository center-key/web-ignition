#!/bin/bash
# Task Runner

# To make this file runnable:
#     $ chmod +x *.sh.command

banner="web-ignition"
projectHome=$(cd $(dirname $0); pwd)

setupTools() {
   cd $projectHome
   echo
   echo $banner
   echo $(echo $banner | sed s/./=/g)
   pwd
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   npm install
   npm update
   npm outdated
   echo
   }

releaseInstructions() {
   cd $projectHome
   repository=$(grep repository package.json | awk -F'"' '{print $4}' | sed s/github://)
   package=https://raw.githubusercontent.com/$repository/master/package.json
   version=v$(grep '"version"' package.json | awk -F'"' '{print $4}')
   pushed=v$(curl --silent $package | grep '"version":' | awk -F'"' '{print $4}')
   released=$(git tag | tail -1)
   minorVersion=$(echo ${pushed:1} | awk -F"." '{ print $1 "." $2 }')
   echo "Local changes:"
   git status --short
   echo
   echo "Recent releases:"
   git tag | tail -5
   echo
   echo "Release progress:"
   echo "   $version (local) --> $pushed (pushed) --> $released (released)"
   echo
   echo "Next release action:"
   nextActionUpdate() {
      echo "   === Increment version ==="
      echo "   Edit pacakge.json to bump $version to next version number"
      echo "   $projectHome/package.json"
      }
   nextActionCommit() {
      echo "   === Commit and push ==="
      echo "   Check in changed source files for $version with the message:"
      echo "   Next release"
      }
   nextActionTag() {
      echo "   === Release checkin ==="
      echo "   Check in remaining changed files with the message:"
      echo "   Release $version"
      echo "   === Tag and publish ==="
      echo "   cd $projectHome"
      echo "   git tag --annotate --message 'Release' $version"
      echo "   git remote --verbose"
      echo "   git push origin --tags"
      echo "   npm publish"
      }
   checkStatus() {
      test "$version" ">" "$pushed" && nextActionCommit || nextActionUpdate
      }
   test "$pushed" ">" "$released" && nextActionTag || checkStatus
   echo
   }

updateCdnVersion() {
   cd $projectHome
   updateVersion="s|web-ignition@[.0-9]*|web-ignition@$minorVersion|"
   sed -i "" $updateVersion README.md
   find css -name "*.html" -o -name "*.css" | xargs sed -i "" $updateVersion
   }

runSpecs() {
   cd $projectHome
   echo "Run specifications:"
   npm test
   echo
   }

publishWebFiles() {
   cd $projectHome
   publishWebRoot=$(grep ^DocumentRoot /private/etc/apache2/httpd.conf | awk -F'"' '{ print $2 }')
   publishSite=$publishWebRoot/centerkey.com
   publishFolder=$publishSite/web-ignition
   cdnBase=https://cdn.jsdelivr.net/npm/web-ignition@$minorVersion/dist
   githubLayouts=https://github.com/center-key/web-ignition/blob/master/css/layouts
   publish() {
      echo "Publishing:"
      echo $publishFolder
      mkdir -p $publishFolder/layouts
      cp -v css/*.html js/*.html   $publishFolder
      cp -v css/layouts/*.html     $publishFolder/layouts
      sed -E -i "" "s#[.][.]/dist#$cdnBase#g"                              $publishFolder/spec-*.html
      sed -E -i "" "s#layouts/([a-z-]*)[.]css#$githubLayouts/\1.css#g"     $publishFolder/layouts.html
      sed -E -i "" "s#[.][.]/[.][.]/dist#$cdnBase#g"                       $publishFolder/layouts/*.html
      sed -E -i "" "s#href=([a-z-]*)[.]css#href=$cdnBase/layouts/\1.css#g" $publishFolder/layouts/*.html
      sed -E -i "" "s#src=([a-z-]*)[.]js#src=$cdnBase/layouts/\1.min.js#g" $publishFolder/layouts/*.html
      ls -o $publishFolder
      echo
      }
   test -w $publishSite && publish
   }

openWebPage() {
   cd $projectHome
   echo "Opening:"
   echo "   css/spec-css.html"
   echo "   js/spec-js.html"
   echo "   css/layouts.html"
   sleep 2
   open css/spec-css.html
   open js/spec-js.html
   open css/layouts.html
   echo
   }

setupTools
releaseInstructions
updateCdnVersion
runSpecs
publishWebFiles
openWebPage

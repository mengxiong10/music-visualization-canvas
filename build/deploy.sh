#!/bin/bash

directory=dist
branch=gh-pages

rm -rf $directory


git worktree add $directory $branch

npm run build:example

cd $directory &&
  git add --all &&
  git commit -m "Deploy updates" &&
  git push origin $branch

cd ../
git worktree remove $directory

echo -e " Deploy success"

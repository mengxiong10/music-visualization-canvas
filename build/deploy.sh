#!/bin/bash

directory=dist
branch=gh-pages

rm -rf $directory


git worktree add $directory $branch

npm run build

cd $directory &&
  git add --all &&
  git commit -m "Deploy updates" &&
  git push origin $branch


git worktree remove $directory

echo -e " Deploy success"

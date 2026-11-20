#!/usr/bin/env bash
# Usage: plan-version.sh <release|ci>
# Prints the version to stamp (also to $GITHUB_OUTPUT). Releases are 0.<n>, one per commit to main, until 1.0.
set -euo pipefail

mode="${1:?mode}"
latest=0
while read -r tag; do
    n="${tag#v0.}"
    if [ "$n" != "$tag" ] && [[ "$n" =~ ^[0-9]+$ ]] && [ "$n" -gt "$latest" ]; then
        latest="$n"
    fi
done < <(gh api --paginate "repos/$GH_REPO/releases" --jq '.[].tag_name')

case "$mode" in
release) version="0.$((latest + 1))" ;;
*) version="0.$latest-ci${GITHUB_RUN_NUMBER:-0}" ;;
esac

echo "$version"
[ -z "${GITHUB_OUTPUT:-}" ] || echo "version=$version" >>"$GITHUB_OUTPUT"

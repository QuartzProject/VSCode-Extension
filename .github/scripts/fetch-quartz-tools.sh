#!/usr/bin/env bash
# Usage: fetch-quartz-tools.sh <tag> <quartz target> <directory>
# Copies quartz and quartz-lsp from that Quartz release's package for the target into <directory>.
set -euo pipefail

tag="${1:?tag}"
target="${2:?quartz target}"
dest="${3:?directory}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

gh release download "$tag" --repo QuartzProject/Quartz --pattern "quartz-*-$target.*" --dir "$work"
mkdir "$work/unpacked"
case "$target" in
Windows-*)
    unzip -q "$work"/*.zip -d "$work/unpacked"
    suffix=.exe
    ;;
*)
    tar -xJf "$work"/*.tar.xz -C "$work/unpacked"
    suffix=
    ;;
esac
mkdir -p "$dest"
for tool in quartz quartz-lsp; do
    install -m 755 "$work"/unpacked/*/bin/"$tool$suffix" "$dest/"
done
ls -l "$dest"

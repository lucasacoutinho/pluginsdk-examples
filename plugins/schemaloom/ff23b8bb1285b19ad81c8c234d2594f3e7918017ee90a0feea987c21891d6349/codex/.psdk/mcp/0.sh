#!/bin/sh
set -eu
set -- "${1}" 'node' "${1}" "${1}"/'server/index.mjs'
cd "${3}"
exec "${2}" "${4}"

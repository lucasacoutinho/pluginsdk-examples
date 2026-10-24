#!/bin/sh
set -eu
set -- "${1}" 'node' "${1}" "${1}"/'automation/session-context.mjs'
cd "${3}"
exec "${2}" "${4}"

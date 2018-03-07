#!/bin/bash
#
# # Print commands before they are executed
# set -v
#
# # Abort script if any task fails
# set -e

# Install dependencies
yarn install -g truffle


yarn test:ganache > ganache.out & # redirect verbose output to file to reduce clutter
GANACHE_PID=$!

# Run contract tests
yarn test

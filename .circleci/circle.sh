#!/bin/bash
#
# # Print commands before they are executed
# set -v
#
# # Abort script if any task fails
# set -e

# Install dependencies

yarn test:ganache > ganache.out & # redirect verbose output to file to reduce clutter

# Run contract tests
yarn test

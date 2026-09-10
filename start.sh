#!/bin/bash
# Start both the Vite dev server and the Python generation server together.
# Ctrl-C stops both.

trap 'kill 0' INT TERM EXIT

python src/app/backend/server.py &
npm run dev &

wait

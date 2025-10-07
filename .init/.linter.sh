#!/bin/bash
cd /home/kavia/workspace/code-generation/noteshare-platform-3306-3315/web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


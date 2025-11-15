#!/bin/bash

# Kill process on port 3000
PORT=${1:-3000}

echo "🔍 포트 $PORT 사용 중인 프로세스 확인 중..."

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✅ 포트 $PORT 는 사용 중이지 않습니다."
else
  echo "❌ 포트 $PORT 를 사용 중인 프로세스 발견: PID $PID"
  echo "🔪 프로세스 종료 중..."
  kill -9 $PID
  echo "✅ 프로세스 종료 완료!"
fi


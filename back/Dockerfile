FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# requirements.txt 복사 및 설치
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 앱 코드 복사
COPY . .

# 포트 설정
EXPOSE 8080

# 원래 앱 실행
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}

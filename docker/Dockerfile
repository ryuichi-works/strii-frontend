FROM node:20.9.0

RUN apt-get update \
  # && apt-get install -y git
  && apt-get -y install git libicu-dev libonig-dev libzip-dev zip unzip locales vim \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && locale-gen en_US.UTF-8 \
  && localedef -f UTF-8 -i en_US en_US.UTF-8

ENV \
  # TZ=UTC \
  TZ=Asia/Tokyo \
  # locale日本語設定
  # LANG=ja_JP.UTF-8 \
  # LANGUAGE=ja_JP:ja 
  # LC_ALL=ja_JP.UTF-8 
  LANG=en_US.UTF-8 \
  LANGUAGE=en_US:en \
  LC_ALL=en_US.UTF-8 

WORKDIR /app

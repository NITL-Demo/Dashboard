
FROM docker.io/java:openjdk-8-jdk

MAINTAINER Hygieia@capitalone.com


ENV SPRING_DATA_MONGODB_DATABASE=dashboard
ENV SPRING_DATA_MONGODB_HOST=10.0.0.9
##ENV SPRING_DATA_MONGODB_PORT=9999
ENV SPRING_DATA_MONGODB_PORT=27017
ENV SPRING_DATA_MONGODB_USERNAME=db
##ENV SPRING_DATA_MONGODB_PASSWORD=ENC(aSPTk36yA/ZklUg75CrZ8w==)
ENV SPRING_DATA_MONGODB_PASSWORD=dbpass

RUN \
  mkdir /hygieia

COPY hygieia /hygieia
COPY properties-builder.sh /hygieia/


WORKDIR /hygieia

VOLUME ["/hygieia/logs"]


EXPOSE 8080
CMD ./properties-builder.sh &&\
  java -Djava.security.egd=file:/dev/./urandom -Djasypt.encryptor.password=$JASYPT_ENCRYPTOR_SECRET -jar api.jar --spring.config.location=/hygieia/dashboard.properties

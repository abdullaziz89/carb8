FROM tomcat:10.0.11-jdk16-corretto
LABEL maintainer="Abdul Aziz"

COPY ./tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml

RUN mkdir -p /usr/local/tomcat/webapps-javaee
COPY ./target/storage.war /usr/local/tomcat/webapps-javaee/storage.war

CMD ["catalina.sh", "run"]

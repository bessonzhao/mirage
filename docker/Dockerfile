FROM jenkins:2.7.1
MAINTAINER Dave Kirk <dave@unfinisheddev.com>

# Ensure our required plugins are installed
COPY jenkins-plugins.txt /usr/share/jenkins/plugins.txt
RUN /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt

# Configure the simple-theme-plugin
RUN rm -f /var/jenkins_home/org.codefirst.SimpleThemeDecorator.xml
COPY simple-theme-decorator.xml /var/jenkins_home/org.codefirst.SimpleThemeDecorator.xml

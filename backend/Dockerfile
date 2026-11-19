# Multi-stage Dockerfile for CampusFix Spring Boot Backend
# Stage 1: Build JAR
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create application user and uploads directory
RUN addgroup -S campusfix && adduser -S campusfix -G campusfix
RUN mkdir -p /app/uploads && chown -R campusfix:campusfix /app

COPY --from=builder /app/target/campusfix-backend-1.0.0.jar app.jar

USER campusfix

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

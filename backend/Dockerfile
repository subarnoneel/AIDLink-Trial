# Stage 1: Build the application
FROM eclipse-temurin:21 AS build
WORKDIR /app

# Install Maven manually
RUN apt-get update && apt-get install -y maven

# Copy the Maven project files
COPY backend/pom.xml ./
COPY backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Use OpenJDK 17 as base image for build
FROM openjdk:17-jdk-slim AS build

# Set working directory inside the container
WORKDIR /app

# Copy the mvnw, pom.xml, and .mvn directory
COPY ./mvnw ./pom.xml /app/
COPY ./.mvn /app/.mvn

# Copy the entire src directory to the container
COPY ./src /app/src

# Make the mvnw script executable
RUN chmod +x /app/mvnw

# Resolve dependencies (to ensure Maven wrapper works)
RUN ./mvnw dependency:resolve

# Build the application
RUN ./mvnw clean package -DskipTests

# Use the same OpenJDK image for runtime
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the compiled application from the build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the application port
EXPOSE 8080

# Command to run the app
CMD ["java", "-jar", "/app/app.jar"]

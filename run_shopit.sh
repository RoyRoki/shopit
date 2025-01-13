#!/bin/bash

# Navigate to client directory and start React dev server
echo "Starting React client..."
cd ~/mybuild/shopit/client || { echo "Client directory not found!"; exit 1; }
npm run dev &
CLIENT_PID=$!

# Navigate to server directory and start Spring Boot server
echo "Starting Spring Boot server..."
cd ~/mybuild/shopit/server || { echo "Server directory not found!"; exit 1; }
./mvnw spring-boot:run &
SERVER_PID=$!

# Start PostgreSQL psql shell as postgres user
echo "Opening PostgreSQL psql shell..."
sudo -u postgres psql

# Kill client and server processes upon exiting PostgreSQL shell
echo "Shutting down client and server..."
kill $CLIENT_PID $SERVER_PID
echo "Done."


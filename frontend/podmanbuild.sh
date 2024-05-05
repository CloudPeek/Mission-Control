#!/bin/bash

# Define the Dockerfile path
DOCKERFILE_PATH="./Dockerfile"

# Define the image name and tag
IMAGE_NAME="cloudpeekfrontend"
IMAGE_TAG="latest"

# Build the Docker image using Docker
podman build -t "$IMAGE_NAME:$IMAGE_TAG" -f "$DOCKERFILE_PATH" .

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Docker build completed successfully."
else
    echo "Docker build failed."
fi

# Test the Docker build by running a container
CONTAINER_NAME="cloudpeekfrontend"

# Run the container using the built image
podman run --name "$CONTAINER_NAME" -d -p 8080:80 "$IMAGE_NAME:$IMAGE_TAG"

# Check if the container is running
if docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" >/dev/null; then
    echo "Container started successfully."
else
    echo "Failed to start container."
fi
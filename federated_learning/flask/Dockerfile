# Use the official Python 3.9.2 image as the base image
FROM python:3.9.2-slim-buster

# Set the working directory within the container
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Install the required dependencies
RUN pip install -r /app/requirements.txt

# Expose port 80 of the container for the Flask application
EXPOSE 80

# Command to run the Flask application
CMD ["python", "/app/app.py"]
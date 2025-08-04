# Use official Python image
FROM python:3.11-slim

# System packages update
RUN apt-get update && apt-get upgrade -y

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Expose port 
EXPOSE 8000

# Run migrations and start server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# docker build -t af-backend .
# docker run af-backend
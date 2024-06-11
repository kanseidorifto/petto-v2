FROM python:3.11.4

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt

RUN mkdir models

# Download animal recognition model
RUN gdown "https://drive.google.com/uc?id=18rubllZ3J2UdbmE0vqKRQm_lfsjrDXmi" -O models/animal_species_recognition_model.h5

# Download cat recognition model
RUN gdown "https://drive.google.com/uc?id=1_khsxtYF0RkBzqRz4gXjVvKzZdootFlW" -O models/cat_breed_recognition_model.h5

# Download dog recognition model
RUN gdown "https://drive.google.com/uc?id=1--Obgd-umEmNDJaP6i5ZFS4ICTOzJdUt" -O models/dog_breed_recognition_model.h5

# Copy the current directory contents into the container at /app
COPY . /app/

# Make port 80 available to the world outside this container
EXPOSE 80

# Run FastAPI when the container launches
CMD ["uvicorn", "recognition-api:app", "--host", "0.0.0.0", "--port", "80"]

from fastapi import Body, FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pickle
import os
import secrets
from keras.models import load_model
from keras.utils import load_img, img_to_array
from keras.applications.efficientnet import preprocess_input

models_dir = './models'

# Завантаження моделй та назв кдасів
animal_species_list = pickle.load(
    open(os.path.join(models_dir, 'animal_species_list.pkl'), 'rb'))
animal_species_recognition_model = load_model(
    os.path.join(models_dir, 'animal_species_recognition_model.h5'))

cat_breed_list = pickle.load(
    open(os.path.join(models_dir, 'cat_breed_list.pkl'), 'rb'))
cat_breed_recognition_model = load_model(
    os.path.join(models_dir, 'cat_breed_recognition_model.h5'))

dog_breed_list = pickle.load(
    open(os.path.join(models_dir, 'dog_breed_list.pkl'), 'rb'))
dog_breed_recognition_model = load_model(
    os.path.join(models_dir, 'dog_breed_recognition_model.h5'))


def freeze_model(model):
    # Заморозка усіх шарів мережі
    for layer in model.layers:
        layer.trainable = False

    # Компідювання моделі після заморозки
    model.compile(optimizer='adam',
                  loss='categorical_crossentropy', metrics=['accuracy'])


# Заморожування моделей, для пришвидшення розпізнавання
freeze_model(animal_species_recognition_model)
freeze_model(cat_breed_recognition_model)
freeze_model(dog_breed_recognition_model)

os.makedirs('./uploads', exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Розпізнавання виду тварини


def predict_species(image_path):
    # Завантаження та попередня обробка зображення
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Прогнозування та визначення класу
    species_prediction = animal_species_recognition_model.predict(img_array)
    predicted_species_index = np.argmax(species_prediction)
    predicted_species = animal_species_list[predicted_species_index]

    return predicted_species

# Розпізнавання порід котів чи собак


def predict_breed(image_path, breed_list, breed_model):
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    breed_prediction = breed_model.predict(img_array)
    predicted_breed_index = np.argmax(breed_prediction)
    predicted_breed = breed_list[predicted_breed_index]

    return predicted_breed

# Визначення ендпоінту


@app.post('/recognize')
async def recognize_animal(file: UploadFile = File(...)):

    # Генерування випадкового імені для файлу
    random_name = secrets.token_hex(8)
    file_extension = file.filename.split(".")[-1]
    random_filename = f"{random_name}.{file_extension}"

    # Збереження файлу
    file_path = os.path.join("./uploads", random_filename)
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Розпізнавання виду
    predicted_species = predict_species(file_path)

    if predicted_species == 'cat' or predicted_species == 'Кіт':
        # Розпізнавання породи для котів
        predicted_breed = predict_breed(
            file_path, cat_breed_list, cat_breed_recognition_model)
    elif predicted_species == 'dog' or predicted_species == 'Собака':
        # Розпізнавання породи для собак
        predicted_breed = predict_breed(
            file_path, dog_breed_list, dog_breed_recognition_model)
    else:
        predicted_breed = None

    # Повернення отриманих результатів
    result = {
        "species": predicted_species,
        "breed": predicted_breed
    }

    return JSONResponse(content=result)

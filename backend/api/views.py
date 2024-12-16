# api/views.py
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import pyttsx3
import speech_recognition as sr
import datetime
import wikipedia
import requests
from bs4 import BeautifulSoup
import random
from django.views import View
import pytesseract
from PIL import Image
import face_recognition
from google.cloud import vision
from langdetect import detect
import os
import cv2
import numpy as np  


# Initialize text-to-speech engine
engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)

def home(request):
    return HttpResponse("Hello, world!")

def speak(audio):
    engine.say(audio)
    engine.runAndWait()

def wish_me(request):
    hour = datetime.datetime.now().hour
    if 0 <= hour < 12:
        greeting = "Good Morning!"
    elif 12 <= hour < 18:
        greeting = "Good Afternoon!"
    else:
        greeting = "Good Evening!"
    
    engine.say(greeting)
    engine.runAndWait()
    return JsonResponse({'message': greeting})

def take_command(request):
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        recognizer.pause_threshold = 2
        audio = recognizer.listen(source)

    try:
        query = recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return JsonResponse({'error': "Sorry, I didn't catch that. Can you please repeat?"})
    except sr.RequestError:
        return JsonResponse({'error': "Sorry, I'm unable to access the Google API at the moment."})

    return JsonResponse({'query': query.lower()})

def get_weather(request, location):
    url = f"https://www.weather.com/en-IN/weather/+today/l/{location}"
    headers = {"User-Agent": "Mozilla/5.0"}
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content, 'html.parser')
    try:
        temp = soup.find('div', class_='today_nowcard-temp').get_text()
        condition = soup.find('div', class_='today_nowcard-phrase').get_text()
        response = f"The current temperature in {location} is {temp} and the weather condition is {condition}."
    except AttributeError:
        response = "Sorry, I couldn't retrieve the weather information for that location."
    speak(response)
    return JsonResponse({'weather': response})

def search_wikipedia(request, query):
    try:
        results = wikipedia.summary(query, sentences=2)
        response = f"According to Wikipedia: {results}"
    except Exception:
        response = "Sorry, I couldn't find information on Wikipedia."
    speak(response)
    return JsonResponse({'summary': response})

def tell_joke(request):
    jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "Parallel lines have so much in common. It's a shame they'll never meet."
    ]
    joke = random.choice(jokes)
    engine.say(joke)
    engine.runAndWait()
    return JsonResponse({'joke': joke})

@csrf_exempt
def text_detection_view(request):
    if request.method == 'POST' and 'image' in request.FILES:
        image = request.FILES['image']
        image_path = f"temp/{image.name}"
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        result = text_detection(image_path)
        os.remove(image_path)
        return JsonResponse({"text": result})
    return HttpResponseBadRequest("Invalid request")

@csrf_exempt
def face_recognition_view(request):
    if request.method == 'POST' and 'image' in request.FILES:
        image = request.FILES['image']
        image_path = f"temp/{image.name}"
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        result = face_recognition_from_image(image_path)
        os.remove(image_path)
        return JsonResponse({"face_locations": result})
    return HttpResponseBadRequest("Invalid request")

@csrf_exempt
def label_image_view(request):
    if request.method == 'POST' and 'image' in request.FILES:
        image = request.FILES['image']
        image_path = f"temp/{image.name}"
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        result = label_image(image_path)
        os.remove(image_path)
        return JsonResponse({"labels": result})
    return HttpResponseBadRequest("Invalid request")

@csrf_exempt
def detect_objects_view(request):
    if request.method == 'POST' and 'image' in request.FILES:
        image = request.FILES['image']
        image_path = f"temp/{image.name}"
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        result = detect_objects(image_path)
        os.remove(image_path)
        return JsonResponse({"objects": result})
    return HttpResponseBadRequest("Invalid request")

@csrf_exempt
def identify_language_view(request):
    if request.method == 'POST':
        data = JsonResponse.loads(request.body)
        text = data.get('text', '')
        result = identify_language(text)
        return JsonResponse({"language": result})
    return HttpResponseBadRequest("Invalid request")

@csrf_exempt
def detect_landmark_view(request):
    if request.method == 'POST' and 'image' in request.FILES:
        image = request.FILES['image']
        image_path = f"temp/{image.name}"
        with open(image_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        result = detect_landmark(image_path)
        os.remove(image_path)
        return JsonResponse({"landmarks": result})
    return HttpResponseBadRequest("Invalid request")

def text_detection(image_path):
    """Detects text from an image."""
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        return f"Error in text detection: {e}"

def face_recognition_from_image(image_path):
    """Detects faces from an image."""
    try:
        image = face_recognition.load_image_file(image_path)
        face_locations = face_recognition.face_locations(image)
        return face_locations
    except Exception as e:
        return f"Error in face recognition: {e}"

def label_image(image_path):
    """Labels objects in an image using Google Vision API."""
    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path_to_your_google_credentials.json'
        client = vision.ImageAnnotatorClient()
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = client.label_detection(image=image)
        labels = response.label_annotations
        return [label.description for label in labels]
    except Exception as e:
        return f"Error in image labeling: {e}"

def detect_objects(image_path):
    """Detects objects using OpenCV and YOLO."""
    try:
        net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
        layer_names = net.getLayerNames()
        output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
        image = cv2.imread(image_path)
        height, width = image.shape[:2]
        blob = cv2.dnn.blobFromImage(image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(output_layers)
        detections = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = int(np.argmax(scores))
                confidence = float(scores[class_id])
                if confidence > 0.5:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    detections.append({'class_id': class_id, 'confidence': confidence, 'box': [center_x, center_y, w, h]})
        return detections
    except Exception as e:
        return f"Error in object detection: {e}"

def identify_language(text):
    """Identifies the language of the given text."""
    try:
        language = detect(text)
        return language
    except Exception as e:
        return f"Error in language identification: {e}"

def detect_landmark(image_path):
    """Detects landmarks in an image using Google Vision API."""
    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'path_to_your_google_credentials.json'
        client = vision.ImageAnnotatorClient()
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = client.landmark_detection(image=image)
        landmarks = response.landmark_annotations
        return [landmark.description for landmark in landmarks]
    except Exception as e:
        return f"Error in landmark detection: {e}"

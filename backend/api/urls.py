from django.urls import path
from .views import (
    wish_me, take_command, get_weather, search_wikipedia, tell_joke, home,
    text_detection_view, face_recognition_view, label_image_view, detect_objects_view,
    identify_language_view, detect_landmark_view, 
)
from . import views2

urlpatterns = [
    path('', home, name='home'),  # Root path points to home view
    path('wish/', wish_me, name='wish_me'),
    path('command/', take_command, name='take_command'),
    path('weather/<str:location>/', get_weather, name='get_weather'),
    path('wiki/<str:query>/', search_wikipedia, name='search_wikipedia'),
    path('joke/', tell_joke, name='tell_joke'),

    # Separate paths for views2 to avoid conflict with 'home'
    path('api-index/', views2.index, name='api-index'),
    path('gemini/', views2.GeminiViewSet.as_view(), name='gemini'),
    path('generate-document/', views2.DocumentGenerationView.as_view(), name='generate_document'),
    path('main/', views2.main, name='main'),
    path('login/', views2.login, name='login'),
    path('logout/', views2.logout, name='logout'),
    path('test/', views2.TestView.as_view()),

    # Paths for image and text processing
    path('text-detection/', text_detection_view, name='text-detection'),
    path('face-recognition/', face_recognition_view, name='face-recognition'),
    path('label-image/', label_image_view, name='label-image'),
    path('detect-objects/', detect_objects_view, name='detect-objects'),
    path('identify-language/', identify_language_view, name='identify-language'),
    path('detect-landmark/', detect_landmark_view, name='detect-landmark'),

]

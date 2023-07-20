import json
from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time
from .models import RoomMembers
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def generateToken(request):
    appId = '0658745698fa487496681e6cc2abc26d'
    appCertificate = '59b07e01df4543c48e1d8e1ac08d2498'
    channelName = request.GET.get('channelName')
    uid = random.randint(0, 230)
    expirationTimeInSeconds = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
    role = 1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)

def lobby(request):

    return render(request, 'baseapp/lobby.html')

def room(request):
    return render(request, 'baseapp/room.html')

@csrf_exempt
def createUser(request):
    data = json.loads(request.body)
    member, created = RoomMembers.objects.get_or_create(
        username=data['name'],
        user_uid=data['uid'],
        room_name=data['room_name']
    )
    return JsonResponse({'name': data['name']}, safe=False)

def getUser(request):
    uid = request.GET.get('uid')
    room_name = request.GET.get('room_name')

    user = RoomMembers.objects.get(
        user_uid=uid,
        room_name=room_name,
    )
    name = user.username
    return JsonResponse({"user_name": name}, safe=False)

@csrf_exempt
def deleteUser(request):
    data = json.loads(request.body)
    member = RoomMembers.objects.get(
        username=data['name'],
        user_uid=data['uid'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse({"message": "member delete successfully"})

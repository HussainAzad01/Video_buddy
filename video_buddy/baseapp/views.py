from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time
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
const APP_ID = '0658745698fa487496681e6cc2abc26d'
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('UID')
let userName = sessionStorage.getItem('userName')

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () =>{
    document.getElementById('roomname').innerText = CHANNEL

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    try{
        await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.error(error)
        window.open('/','_self')
    }

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let member = await createUser()    

    let player =`<div class="video-container" id="user-container-${UID}">
                        <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                        <div class="video-player" id="user-${UID}"></div>
                </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
    
    localTracks[1].play(`user-${UID}`)
    await client.publish([localTracks[0], localTracks[1]])
    
}

let handleUserJoined = async(user, mediaType)=>{
    remoteUsers[user.uid] = user
    await client.subscribe(user,mediaType)
    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if(player != null){
            player.remove()
        }

        let member = await getUser(user)

        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">${member.user_name}</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
            </div>`

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`) 
        await client.publish(remoteUsers[0],remoteUsers[1])
    }
    if(mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async(user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
} 

let leaveStream = async(e) =>{
    for (let i=0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
        e.target.style.backgroundColor = 'red'
    }
    await client.leave()
    window.open('/', '_self')
}

let toggleMic = async(e) =>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = '#4d4d4d'
    }
}

let toggleCamera = async(e) =>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }
    else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = '#4d4d4d'
    }
}

let createUser = async() =>{
    let response = await fetch('/create_user/',{
        method:'POST',
        headers:{'Content-Type':'application/json'},

        body:JSON.stringify({'name': userName, 'uid':UID, 'room_name':CHANNEL})
    })
    let member = await response.json()
    return member
}

let getUser = async(user) =>{
    let response = await fetch(`/getUser/?uid=${user.uid}&room_name=${CHANNEL}`)
    let member = await response.json()
    return member
}

let deleteUser = async() =>{
    let response = await fetch('/delete_user/',{
        method:'POST',
        headers:{'Content-Type':'application/json'},

        body:JSON.stringify({'name': userName, 'uid':UID, 'room_name':CHANNEL})
    })
}


joinAndDisplayLocalStream()

var leave_btn = document.getElementById('leave-btn').addEventListener('click', leaveStream)

var mute_btn = document.getElementById('mic-btn').addEventListener('click', toggleMic)

var mute_btn = document.getElementById('camera-btn').addEventListener('click', toggleCamera)


const playPauseButton = document.querySelector(".play-pause-button")
const fullScreenButton = document.querySelector(".fullscreen-btn")
const muteButton = document.querySelector(".mute-btn")
const volumeSlider = document.querySelector(".volume-slider")
const videoContainer = document.querySelector(".video-container")
const video = document.querySelector("video")
const currentTime = document.querySelector(".current-time")
const totalTime = document.querySelector(".total-time")

const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")
const timelineContainer = document.querySelector(".timeline-container")
const bigPlayButton = document.querySelector(".big-play-button")

bigPlayButton.addEventListener('click', togglePlay)

playPauseButton.addEventListener('click', togglePlay)

fullScreenButton.addEventListener('click', toggleFullScreen)

function toggleFullScreen(){
    if(document.fullscreenElement == null){
        videoContainer.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
}

document.addEventListener("fullscreenchange", ()=>{
    videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})

function togglePlay(){
    if (video.paused) {
        video.play()
        videoContainer.classList.add("played")
    } else {
        video.pause()
    }
}

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused")
})

// VOLUME

muteButton.addEventListener("click" , toggleMute)
volumeSlider.addEventListener("input", e=>{
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute(){
    video.muted = !video.muted
}

video.addEventListener("volumechange", ()=>{
    volumeSlider.value = video.volume
    let volumeLevel
    if(video.muted || video.volume === 0){
        volumeSlider.value = 0
        volumeLevel = "muted"
    }else if (video.volume >= .5){
        volumeLevel = "high"
    }else{
        volumeLevel = "low"
    }

    videoContainer.dataset.volumeLevel = volumeLevel
})


//TIME

video.addEventListener("loadeddata", ()=>{
    totalTime.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", ()=>{
    currentTime.textContent = formatDuration(video.currentTime)
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty("--progress-position",percent)
})

const leadingZeroFormat = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})
function formatDuration(time){
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time/60) % 60
    const hours = Math.floor(time / 3600)
    if(hours === 0){
        return `${minutes}:${leadingZeroFormat.format(seconds)}`
    }else{
        return `${hours}:${leadingZeroFormat.format(minutes)}:${leadingZeroFormat.format(seconds)}`
    }
}


//TIMELINE

timelineContainer.addEventListener("mousemove", handleTimelineUpdate)

timelineContainer.addEventListener("mousedown", togglecrubbing)

document.addEventListener("mouseup", e=>{
    if(isScrubbing) togglecrubbing(e)
})

document.addEventListener("mousemove", e=>{
    if(isScrubbing) handleTimelineUpdate(e)
}
)

let isScrubbing = false
let wasPaused

function togglecrubbing(e){
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x),rect.width) / rect.width

    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle("scrubbing", isScrubbing)
    if(isScrubbing){
        wasPaused = video.paused
        video.pauses()
    }else{
        video.currentTime = percent * video.duration
        if(!wasPaused) video.play()
    }

    handleTimelineUpdate(e)
}

function handleTimelineUpdate(e){
    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x),rect.width) / rect.width

    previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10))

    timelineContainer.style.setProperty("--preview-position", percent)

    if(isScrubbing){
        e.preventDefault()
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}
const playControlBtn = document.querySelector('.play-controls');
const playerBtn = document.querySelector('.player-btn');
const theaterBtn = document.querySelector('.theater-btn');
const fullScreenBtn = document.querySelector('.full-screen-btn');
const speedBtn  = document.querySelector('.speed-btn');
const captionBtn = document.querySelector('.captions-btn');
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const  muteBtn = document.querySelector('.mute-btn');
const volumeSlider = document.querySelector('.volume-slider');
const controlContainer = document.querySelector('.controls_container');
const previewImg = document.querySelector('.preview-img');
const thumbNail = document.querySelector('.thumbnail-img');
const timelineContainer = document.querySelector('.timeline-container');

const playerContainer = document.querySelector('.player');
const VideoEl = document.querySelector('video');



document.addEventListener('keydown', e =>{
    const tagName = document.activeElement.tagName.toLowerCase();
    if(tagName === 'input')return
    switch (e.key.toLowerCase()){
       
        case " ":
            if(tagName === "button")return
            case "k":
                togglePlay()
                break
                case "f":
      toggleFullScreenMode()
      break
    case "t":
      toggleTheaterMode()
      break
    case "i":
      togglePlayerMode()
      break
      case "m":
        toggleMute()
        break
        case "arrowleft":
    case "j":
      skip(-5)
      break
    case "arrowright":
    case "l":
      skip(5)
      break
    
    case"c":
    toggleCaptn()
    break
    }
});

// scrubbing
let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e){
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width)/rect.width;

  isScrubbing = (e.buttons & 1) === 1;
  playerContainer.classList.toggle('scrubbing', isScrubbing);
  
  if (isScrubbing){
    wasPaused = VideoEl.pause;
    VideoEl.pause;
  }else {
    VideoEl.currentTime = percent * VideoEl.duration;
    if(!wasPaused) VideoEl.play();
  }
  timelineUpdate(e)
}

// timeline
timelineContainer.addEventListener('mousemove',timelineUpdate);
timelineContainer.addEventListener('mousedown',toggleScrubbing);
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
  if (isScrubbing) timelineUpdate(e)
})

function timelineUpdate(e){
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width)/rect.width;
  const previewImgNumber = Math.max(1,Math.floor(percent*VideoEl.duration)/ 10);
  const previewImgSrc = `previewImgs/preview${previewImgNumber}.Jpg`;
  previewImg.Src = previewImgSrc;
  timelineContainer.style.setProperty("--preview-position", percent)

  if (isScrubbing){
    e.preventDefault();
    thumbNail.src = previewImgSrc;
    timelineContainer.style.setProperty("--progress-position",percent);
  }
}



// PlayBackSpeed
speedBtn.addEventListener("click", changePlaybackSpeed)

function changePlaybackSpeed() {
  let newPlaybackRate = VideoEl.playbackRate + 0.25
  if (newPlaybackRate > 3) newPlaybackRate = 0.25
  VideoEl.playbackRate = newPlaybackRate
  speedBtn.textContent = `${newPlaybackRate}x`
}

// caption
const captions = VideoEl.textTracks[0]
captions.mode = 'hidden';
captionBtn.addEventListener('click',toggleCaptn)

function toggleCaptn(){
    const isHidden = captions.mode === 'hidden';
    captions.mode = isHidden ? "showing" : "hidden";
    playerContainer.classList.toggle('captions',isHidden);
}
// Duration
VideoEl.addEventListener("loadeddata", () => {
    totalTime.textContent = formatDuration(VideoEl.duration)
  })
  
  VideoEl.addEventListener("timeupdate", () => {
    currentTime.textContent = formatDuration(VideoEl.currentTime)
    const percent = VideoEl.currentTime / VideoEl.duration
    timelineContainer.style.setProperty("--progress-position", percent)
  })
  
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  })
  function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`
    }
}

function skip(duration){
    VideoEl.currentTime += duration
}
//volume
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
  VideoEl.volume = e.target.value
  VideoEl.muted = e.target.value === 0
})

function toggleMute() {
  VideoEl.muted = !VideoEl.muted
}

VideoEl.addEventListener("volumechange", () => {
  volumeSlider.value = VideoEl.volume
  let volumeLevel
  if (VideoEl.muted || VideoEl.volume === 0) {
    volumeSlider.value = 0
    volumeLevel = "muted"
  } else if (VideoEl.volume >= .5) {
    volumeLevel = "high"
  } else {
    volumeLevel = "low"
  }

  playerContainer.dataset.volumeLevel = volumeLevel
})


// view mode
playerBtn.addEventListener('click',togglePlayerMode);
theaterBtn.addEventListener('click',toggleTheaterMode);
fullScreenBtn.addEventListener("click", toggleFullScreenMode)


function togglePlayerMode(){
    if (playerContainer.classList.contains("player-btn")) {
        document.exitPictureInPicture()
      } else {
        VideoEl.requestPictureInPicture()
      }
    }

function toggleTheaterMode(){
playerContainer.classList.toggle('theater');
}

function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    playerContainer.requestFullscreen()
  } else {
    document.exitFullscreen()
    playerContainer.classList.add('close')
  }
}

document.addEventListener("fullscreenchange", () => {
 playerContainer.classList.toggle("full-screen",document.fullscreenElement)
})
  VideoEl.addEventListener("enterpictureinpicture", () => {
    playerContainer.classList.add("player-btn")
  })
  
  VideoEl.addEventListener("leavepictureinpicture", () => {
   playerContainer.classList.remove("player-btn")
  })

// play/pause
playControlBtn.addEventListener('click',togglePlay);
VideoEl.addEventListener('click',togglePlay);
function togglePlay(){
    VideoEl.paused ? VideoEl.play(): VideoEl.pause();
}

VideoEl.addEventListener('play', () => {
playerContainer.classList.remove('paused')
});
VideoEl.addEventListener('pause', () => {
    playerContainer.classList.add('paused')
    })

    let fullscreenchange = (document.onwebkitfullscreenchange)? 'onwebkitfullscreenchange':(document.onfullscreenchange)?
    'onfullscreenchange': (document.onmozfullscreenchange)?
    'onmozfullscreenchange': (document.MSFullScreenChange)?
    'MSFullscreenChange': null;
    if(fullscreenchange){
        document[fullscreenchange] = toggleFull;
    }
     
    function toggleFull(ev){
      let element = document.webkitFullscreenElement;
      if(element){
          element.classList.add('big');
          console.log('big class added')
      }else{
          //remove it from the first element with it
          element = document.querySelector('h1.big, audio.big, video.big');
          element.classList.remove('big');
          //when people use esc instead of dblclick
      }
    }
    VideoEl.addEventListener('click', goBig);
      function goBig(ev){
        let element = ev.currentTarget;
            console.dir(element);
            if(! document.webkitFullscreenElement){
                if(element.webkitRequestFullscreen){
                    element.webkitRequestFullscreen();
                }else{
                    console.log('element cannot be fullscreened');
                }
            }else{
                console.log(document.webkitFullscreenElement, 'is the full screen element');
            }
      }

      VideoEl.addEventListener('dblclick', goHome);
      function goHome(ev){
        let element = ev.target;
        console.log(element)
        element.classList.remove('big');
        if( document.webkitFullscreenEnabled){
            document.webkitExitFullscreen();
        }   
      }
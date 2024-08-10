
let currentSong = new Audio();
let finalsongs = document.querySelector(".finalsongs");
let play1 = document.querySelector("#play");
let nextsong = document.querySelector("#nextsong");
let presong = document.querySelector("#presong");
let music = document.querySelector("music");
let hamburger = document.querySelector(".hamburger");
let close = document.querySelector(".close");
let songList;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Get song takes a folder and return all the songs stored in it ... 

async function getSong(folder) {

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    currFolder = folder;
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);

        }

    }
    
    return songs;

}
let playmusic = (track) => {
    currentSong.src = `/${currFolder}/` + track;

    currentSong.play();
    play1.src = "pause.svg"

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00";

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    })

}

async function main() {

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        
        e.addEventListener("click", async (item) => {
            
            let songList = await getSong(`songs/${item.currentTarget.dataset.folder}`);
            

            let songUl = finalsongs.firstElementChild
            songUl.innerHTML = "" ; 
            for (const song of songList) {
                songUl.innerHTML = songUl.innerHTML + `<li>
                            <div class="songbox">
                            <div class="leftsongbox">
                                <img src="music.svg" alt="music">
                                <p>${song.replaceAll("%20", " ")}</p>
                            </div>
                            <div class="rightsongbox">
                                <p>play</p>
                                <img id="music" src="play.svg" alt="">
                            </div>
                        </div>
        
        </li>` ;

            }

            Array.from(finalsongs.getElementsByTagName("li")).forEach(e => {
                e.addEventListener("click", () => {

                    console.log(e.getElementsByTagName('p')[0].innerHTML);
                    playmusic(e.getElementsByTagName('p')[0].innerHTML);
                })
            })
        })

    })

    // Get the list of all the songs ... all the songs are stored in songlist ... 

    // console.log(songList) ; 
    // console.log(songList[1]);



    play1.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play1.src = "pause.svg";


        } else {
            currentSong.pause();
            play1.src = "play1.svg";

        }
    })
    hamburger.addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })

    close.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })
    // Add event listener to add previous and next button 

    presong.addEventListener("click", () => {
        
        
        let index = songList.indexOf(currentSong.src.split(`/${currFolder}/`)[1]);
        if ((index - 1) >= 0) {
            playmusic(songList[index - 1]);
        }
    })

    nextsong.addEventListener("click", () => {
        
        let index = songList.indexOf(currentSong.src.split(`/${currFolder}/`)[1]);
        
        if ((index + 1) > length) {
            playmusic(songList[index + 1]);

        }
    })




}


main(); 
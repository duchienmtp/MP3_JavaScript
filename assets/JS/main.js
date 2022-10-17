const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'PLAYER'

const playlist = $('.playlist')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
        name: "Hira Hira Hirara",
        singer: "ClariS",
        path: "/JavaScript/Lesson1/MP3/assets/music/HiraHiraHirara.mp3",
        image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
        name: "Yume no mata yume",
        singer: "Mafumafu",
        path: "/JavaScript/Lesson1/MP3/assets/music/YumeNoMataYume.mp3",
        image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
        name: "Lens",
        singer: "Ikuta Lilas",
        path: "/JavaScript/Lesson1/MP3/assets/music/Lens.mp3",
        image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
        name: "Answer",
        singer: "Ikuta Lilas",
        path: "/JavaScript/Lesson1/MP3/assets/music/Answer.mp3",
        image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
        name: "Zankyou Sanka",
        singer: "Aimer",
        path: "/JavaScript/Lesson1/MP3/assets/music/ZankyouSanka.mp3",
        image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
        name: "Unlasting",
        singer: "LiSA",
        path:
            "/JavaScript/Lesson1/MP3/assets/music/Unlasting.mp3",
        image:
            "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        },
        {
        name: "Sayonara Energy",
        singer: "KOBASOLO",
        path: "/JavaScript/Lesson1/MP3/assets/music/SayonaraEnergy.mp3",
        image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],

    setConfig: function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div> 
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage= `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        app.isRandom = app.config.isRandom;
        app.isRepeat = app.config.isRepeat;
    },

    nextSong: function() {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        app.loadCurrentSong();
    },

    prevSong: function() {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length-1;
        }
        app.loadCurrentSong();
    },

    playRandomSong: function() {
        // let newIndex = 0;
        // do {
        //     newIndex = Math.floor(Math.random() * app.songs.length);
        // } while(newIndex === app.currentIndex)
        // app.currentIndex = newIndex;
        const setIndexSong = new Set();
            setIndexSong.add(app.currentIndex);
            let rand;
            do {
                rand = Math.floor(Math.random() * app.songs.length);
            } while (setIndexSong.has(rand));

            // Reload current index and its song
            app.currentIndex = rand;
            app.loadCurrentSong();
            if (setIndexSong.size == app.songs.length - 1) {
                setIndexSong.clear();
            }
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300)
    },

    handleEvent: function() {
        const _this = this;

        // Scroll Event - Zoom in or out song avatar
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Play Event
        const playBtn = $('.btn-toggle-play');
        const player = $('.player');
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // When song plays => changes icon
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // When song pauses => change icon
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Progress of the song
        const progress = $('#progress');
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // When seeking the audio
        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // CD spinning
        const cdThumbAnimate = cdThumb.animate ([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Play next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Play prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
            _this.prevSong();
        }
            audio.play()
            _this.render();
            _this.scrollToActiveSong();
        }

        // Random a song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Repeat a song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Song ends
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.loop = true;
                audio.load();
            } else {
                nextBtn.click()
            }
        }

        // Clicking the playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if ( songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
                    audio.play();
                    _this.render()
                }

                if (e.target.closest('.option')) {
                    alert('Click cc :))))))))');
                }
            }
        }
    },


    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}

app.start();
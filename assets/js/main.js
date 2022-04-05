/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd'); 
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const loop = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isLoop: false,
    // Song data
    songs: [
        {
            name: 'Đám Cưới Nha',
            singger: 'Hồng Thanh, DJ Mie',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Muốn Em Là',
            singger: 'Keyo',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Chạy Về Nơi Phía Anh',
            singger: 'Khắc Việt',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Hà Giang Ơi',
            singger: 'Quách Beem',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Vui Lắm Nha',
            singger: 'Hương Ly ft Jombie',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Độ Tộc 2',
            singger: 'Phúc Du ft Pháo',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Tình Yêu Bát Cơm Rang',
            singger: 'Thiện Hưng',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Yêu Là Cưới',
            singger: 'Phát Hồ',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Độc Thân Không Phải Là Ế',
            singger: 'Trần Trung Đức',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Đời Là Thế Thôi 2',
            singger: 'Quách Beem',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        }
    ],

    // Render Songs
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singger}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Quay / dừng cdThumb
        const cdThumbAnimate = cdThumb.animate(
            [
                {transform: 'rotate(360deg)'}
            ],
            {
                duration: 50000,
                iterations: Infinity
            }
        );
        cdThumbAnimate.pause();

        // xử lý scroll top
        document.onscroll = function() {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = (newCdWidth > 0) ? newCdWidth + 'px' : 0;
        }

        // xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // khi bài hát được chạy
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi bài hát bị dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Xử lý khi thời gian thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent; 
            }
        }

        // xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // Xử lý khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToView();
        }

        // xử lý khi quay lại bài hát trước
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToView();
        }

        // xử lý khi bật chế độ random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // xử lý khi bật chế độ lặp lại
        loop.onclick = function() {
            _this.isLoop =!_this.isLoop;
            loop.classList.toggle('active', _this.isLoop);
        }

        // Xử lý khi hết bài hát
        audio.onended = function() {
            if(_this.isLoop) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý khi click vào bài hát
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                // xử lý khi bấm vào bài hát
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                } 
                // xử lý khi bấm vào option
                else if(e.target.closest('.option')) {

                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToView: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        },200);
    },
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe, xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Load bài hát đầu tiên
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
};

app.start();
/*global Vue*/
/*global fetch*/
/*global moment*/

var app = new Vue({
    el: '#app',
    data: {
        search: '',
        results: [],
        fetchMade: false,
        songInfo: false,
        sortSelected: '',
    },
    methods: {
        fetchREST() {
            var extension = "Stockton+Jenkins";
            var url = "https://itunes.apple.com/search?term=" + extension;
            console.log("URL: " + url);
            fetch(url)
                .then((data) => {
                    return data.json();
                })
                .then((json) => {
                    console.log(json);
                    this.results = json.results;

                    this.results.forEach(song => {
                        song.releaseDate = song.releaseDate.substring(0, 10);
                        song.releaseDate = moment(song.releaseDate).format('MMMM Do YYYY');
                    })

                    console.log("results: ", this.results);
                    this.fetchMade = true;
                });
        },
        toggleSongInfo() {
            this.songInfo = !this.songInfo;
            return this.songInfo;
        },
        sort() {
            if (this.sortSelected === "songName") {
                let sortBySong = this.results.slice(0);
                sortBySong.sort((a, b) => {
                    var x = a.trackCensoredName.toLowerCase();
                    var y = b.trackCensoredName.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                this.results = sortBySong;
            }
            else if (this.sortSelected === "albumName") {
                let humanX = this.results.filter(song => {
                    return song.collectionName == "Human X";
                }).sort((a, b) => {
                    var x = a.trackNumber;
                    var y = b.trackNumber;
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                
                let hourglass = this.results.filter(song => {
                    return song.collectionName == "Hourglass";
                }).sort((a, b) => {
                    var x = a.trackNumber;
                    var y = b.trackNumber;
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                
                this.results = humanX.concat(hourglass);
            }
            else {
                console.log('There was an error in selecting a sort');
            }
        }
    },
    computed: {
        chunkedCards() {
            let count = 0;
            let chunkedCards = [];
            for (let i = 0; i < 9; i++) {
                let row = [];
                for (let j = 0; j < 3; j++) {
                    row.push(this.results[count]);
                    count++;
                }
                if (row !== null & row !== undefined) {
                    chunkedCards.push(row);
                }
            }
            console.log('CC: ', chunkedCards);
            return chunkedCards;
        },
    }
})

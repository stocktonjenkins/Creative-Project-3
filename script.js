/*global Vue*/
/*global fetch*/
/*global moment*/

var app = new Vue({
    el: '#app',
    data: {
        search: '',
        results: [],
        song: '',
        fetchMade: false,
        songInfo: false,
        sortSelected: '',
    },
    methods: {
        fetchREST() {
            var url = "https://itunes.apple.com/search?term=Stockton+Jenkins";
            console.log("API URL: " + url);
            fetch(url)
                .then((data) => {
                    return data.json();
                })
                .then((json) => {
                    this.results = json.results;
                    let i = 0;
                    this.results.forEach(song => {
                        song.songInfo = this.songInfo;
                        song.id = i;
                        i++;
                    })
                    this.results.forEach(song => {
                        song.releaseDate = song.releaseDate.substring(0, 10);
                        song.releaseDate = moment(song.releaseDate).format('MMMM Do YYYY');
                    });
                    this.fetchMade = true;
                });
        },
        toggleSongInfo(song) {
            console.log('song id: ',song.id);
            let j = this.results.filter(result => {
                return result.id === song.id;
            })[0].id;
            this.results[j].songInfo = !this.results[j].songInfo;
            console.log(this.results[j].songInfo)
            return this.results[j].songInfo;
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
        },
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
            return chunkedCards;
        },
    }
});

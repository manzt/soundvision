'use strict';
const fs = require('fs');
const _ = require('underscore');
const d3 = require('d3');

let parseTime = d3.timeParse("%m/%d/%y")

let rawdata = fs.readFileSync('data.json');
let library = JSON.parse(rawdata);

library = library.map(item => {
  item.date_added = parseTime(item.date_added.slice(0, 7));
  return Object.assign(item, {unique: item.album+item.artist})
});

let albums = _.uniq(library, (item, key, unique) => {
  return item.unique;
});

let playCount = albums.map(album => {
  return {
    plays: 0,
    name: album.unique
  }
})

let uniqueAlbums = albums.map(album => {
  return {
    artist: album.artist,
    album: album.album,
    date_added: album.date_added,
    genre: null,
    total_plays: null,
    album_id: null,
    name: album.unique
  }
})

for (let j = 0; j < library.length; j++) {
  for (let i = 0; i < uniqueAlbums.length; i++) {

    if ( Object.values(uniqueAlbums[i]).indexOf(library[j].unique) > -1) {
      uniqueAlbums[i].total_plays += library[j].play_count;
    }

  }
}

uniqueAlbums.forEach(item => delete item.name);

uniqueAlbums = uniqueAlbums.filter(item => item.total_plays > 0);

console.log(uniqueAlbums)

fs.writeFile('./data2.json', JSON.stringify(uniqueAlbums) , 'utf-8');

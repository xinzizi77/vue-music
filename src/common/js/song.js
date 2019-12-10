import {getLyric} from 'api/song';
import {ERR_OK} from 'api/config';
import {Base64} from 'js-base64';

export default class Song {
  constructor ({id, mid, name, singer, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject(new Error('no lyric'));
        }
      });
    });
  }
};

export function createSong(musicData, songVkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    singer: filterSinger(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=1819638027&uin=0&fromtag=66`
  });
};

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return '';
  }
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join('/');
}
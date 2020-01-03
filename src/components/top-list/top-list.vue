<template>
  <transition name="slide">
    <musicList :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></musicList>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list';

import {mapGetters} from 'vuex';

import {getMusicList} from 'api/rank';
import {ERR_OK} from 'api/config';
import {getMusic} from 'api/song';

import {createSong} from 'common/js/song';

export default {
  data() {
    return {
      songs: [],
      rank: true
    };
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank');
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist);
          console.log(this.songs);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        const musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          getMusic(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items;
              const songVkey = svkey[0].vkey;
              const newSong = createSong(musicData, songVkey);
              ret.push(newSong);
            }
          });
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>
<style lang="stylus" scoped>
  .slide-enter-active, . slide-leave-activce
    transition: all 0.3s ease;
  .slide-enter, .slide-leave-top
    transform: translate3d(100%, 0, 0)
</style>
<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          @scrollToEnd="searchMore"
          ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"  title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length && !hasMore">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
import {search} from 'api/search';
import {getMusic} from 'api/song';
import {ERR_OK} from 'api/config';

import {createSong} from 'common/js/song';
import Singer from 'common/js/singer';

import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result';

import {mapMutations, mapActions} from 'vuex';

const TYPE_SINGER = 'singer';
const perpage = 20;

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      searchSongs: [],
      zhida: {},
      pullup: true,
      hasMore: false,
      beforeScroll: true
    };
  },
  methods: {
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = [];
          this.zhida = res.data.zhida;
          this.searchSongs = this._normalizeSongs(res.data.song.list);
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) return;
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.searchSongs = this._normalizeSongs(res.data.song.list);
          this._checkMore(res.data);
        }
      });
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit('select');
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    listScroll() {
      this.$emit('listScroll');
    },
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false;
      }
    },
    _getResult(zhida, newValue) {
      let ret = [];
      if (zhida && zhida.singerid) {
        ret.push({...zhida, ...{type: TYPE_SINGER}});
      }
      if (newValue) {
        ret = ret.concat(newValue);
      }
      if (this.page > 1) {
        this.result = this.result.concat(ret);
      } else {
        this.result = ret;
      }
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
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
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    searchSongs(newValue) {
      this._getResult(this.zhida, newValue);
    },
    query() {
      this.search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
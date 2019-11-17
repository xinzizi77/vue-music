<template>
    <div class="singer">
        歌手页
    </div>
</template>
<script>
import {getSingerList} from 'api/singers';
import {ERR_OK} from 'api/config';
import Singer from 'common/js/singer';

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;

export default {
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = res.data.list;
          this._normalizeSinger(this.singerList);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }));
        }

        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }));
      });

      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      console.log(hot.concat(ret));
    }
  }
};
</script>
<style lang="stylus" scoped>
  .singer
    position: fixed;
    top: 88px;
    bottom: 0;
    widthL 100%
</style>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/util';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  activated() {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal);
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method');
    }
  }
};

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        const seqList = this.sequenceList.slice();
        list = seqList;
      }
      this.resetCurrentIndex(list);
      this.setplayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setplayList: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  }
};

export const searchMixin = {
  data() {
    return {
      query: ''
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
};
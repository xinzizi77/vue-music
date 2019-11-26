import * as types from './mutation-types';

const mutations = {
  [types.SER_SINGER](state, singer) {
    state.singer = singer;
  }
};

export default mutations;
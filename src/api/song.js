import {commonParams} from './config';
import axios from 'axios';

export function getMusic(mid) {
  const url = '/api/music';

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    filename: 'C400' + mid + '.m4a',
    guid: 1819638027,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    g_tk: 5381,
    uin: 0,
    cid: 205361747,
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};

export function getLyric(mid) {
  const url = '/api/lyric';

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};
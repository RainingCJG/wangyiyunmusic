const _api = 'https://api.imjad.cn/cloudmusic/'
export default {
  getList (type, searchType, offset, limit) {
    return _api + '?type=search&search_type=' + searchType + '&s=' + type + '&offset=' + offset + '&limit=' + limit
  },
  getPlayListDetail (id) {
    return _api + '?type=playlist&id=' + id
  },
  getSong (id) {
    return _api + '?type=song&id=' + id
  },
  getlyric (id) {
    return _api + '?type=lyric&id=' + id
  }
}

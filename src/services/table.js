import request from "../../box-ui/util/request.js";

const TableService = {
  getTableList() {
    return request({
      method: "GET",
      url: "https://ccnubox.muxixyz.com/api/table/",
      headers: {
        'Accept': 'application/json',
        'Bigipserverpool': "89172160.20480.0000",
        'Sid': "2016210773",
        'Jsessionid': "0353EA4BBA48F76FDD41C36A52F10898",
        'Authorization': "Basic MjAxNjIxMDc3MzowMzA2MTAxNDkwY3J5"
      }
    });
  },
  addLesson(big, sid, jid, password, data) {
    return request({
      method: "POST",
      url: "https://ccnubox.muxixyz.com/api/ios/table/",
      headers: {
        'Bigipserverpool': big,
        'Sid': sid,
        'Jsessionid': jid,
        'Authorization': "Basic " + btoa(sid + ":" + password)
      },
      body: data
    });
  },
  editLesson(big, sid, jid, password, id, data) {
    return request({
      method: "PUT",
      url: "https://ccnubox.muxixyz.com/api/table/" + id + "/",
      headers: {
        'Bigipserverpool': big,
        'Sid': sid,
        'Jsessionid': jid,
        'Authorization': "Basic " + btoa(sid + ":" + password)
      },
      body: data
    });
  },
  deleteLesson(big, sid, jid, password, id) {
    return request({
      method: "DELETE",
      url: "https://ccnubox.muxixyz.com/api/table/" + id + "/",
      headers: {
        'Bigipserverpool': big,
        'Sid': sid,
        'Jsessionid': jid,
        'Authorization': "Basic " + btoa(sid + ":" + password)
      }
    });
  }
};

export default TableService;

import request from "../../box-ui/util/request.js";

const TableService = {
  getErrorMessage() {
    return request({
      method: "GET",
      url:
        "https://ccnubox.muxixyz.com/api/msg/?os=ios&page=com.muxistudio.table.main"
    });
  },
  getTableListV2(options) {
    let headers = {
      Accept: "application/json",
      Authorization: `Basic ${options.token}`
    };
    return request({
      method: "GET",
      url: "https://ccnubox.muxixyz.com/api/table/v2",
      headers
    });
  },
  getTableList(options) {
    let headers = {
      Accept: "application/json",
      Sid: options.sid,
      Authorization: `Basic ${options.token}`
    };
    if (options.cookie) {
      headers.Jsessionid = options.cookie.Jsessionid;
      headers.Bigipserverpool = options.cookie.Bigipserverpool;
      return request({
        method: "GET",
        url: "https://ccnubox.muxixyz.com/api/table/",
        headers
      });
    }
    return request({
      method: "GET",
      url: "https://ccnubox.muxixyz.com/api/table/cache/",
      headers
    });
  },
  addLessonV2(data, token) {
    return request({
      method: "POST",
      url: "https://ccnubox.muxixyz.com/api/table/v2",
      headers: {
        Authorization: "Basic " + token
      },
      body: data
    });
  },
  addLesson(big, sid, jid, password, data) {
    return request({
      method: "POST",
      url: "https://ccnubox.muxixyz.com/api/table/",
      headers: {
        Bigipserverpool: "xxx",
        Sid: sid,
        Jsessionid: "xxx",
        Authorization: "Basic " + btoa(sid + ":" + password)
      },
      body: data
    });
  },
  deleteLessonV2(options) {
    let headers = {
      Accept: "application/json",
      Authorization: "Basic " + btoa(options.sid + ":" + options.pwd)
    };

    return request({
      method: "DELETE",
      url: "https://ccnubox.muxixyz.com/api/table/v2?id=" + options.id,
      headers
    });
  },
  deleteLesson(options) {
    let headers = {
      Bigipserverpool: "xxx",
      Jsessionid: "xxx",
      Accept: "application/json",
      Sid: options.sid,
      Authorization: "Basic " + btoa(options.sid + ":" + options.pwd)
    };

    return request({
      method: "DELETE",
      url: "https://ccnubox.muxixyz.com/api/table/" + options.id + "/",
      headers
    });
  }
};

export default TableService;

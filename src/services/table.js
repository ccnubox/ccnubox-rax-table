import request from "../../box-ui/util/request.js";

const TableService = {
  getErrorMessage() {
    return request({
      method: "GET",
      url:
        "https://ccnubox.muxixyz.com/api/msg/?os=ios&page=com.muxistudio.table.main"
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
      url: "https://ccnubox.muxixyz.com/api/table/cache",
      headers
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
  deleteLesson(options) {
    alert(JSON.stringify(options));
    let headers = {
      Bigipserverpool: "xxx",
      Jsessionid: "xxx",
      Accept: "application/json",
      Sid: options.sid,
      Authorization: `Basic ${options.token}`
    };

    return request({
      method: "DELETE",
      url: "https://ccnubox.muxixyz.com/api/table/" + options.id + "/",
      headers
    });
  }
};

export default TableService;

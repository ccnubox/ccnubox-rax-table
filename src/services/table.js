import request from "../box-ui/util/request.js";

const GradeService = {
  getTableList() {
    return request({
      method: "GET",
      url: "https://ccnubox.muxixyz.com/api/table/",
      headers: {
        'Bigipserverpool': "89172160.20480.0000",
        'Sid': "2016210773",
        'Jsessionid': "3892DCD4F0D2B95656A77CECC667287D",
        'Authorization': "Basic MjAxNjIxMDc3MzowMzA2MTAxNDkwY3J5"
        //'Authorization': "Basic " + btoa("id:password")
      }
    });
  },
  addLesson(data) {
    return request({
      method: "POST",
      url: "https://ccnubox.muxixyz.com/api/ios/table/",
      headers: {
        'Bigipserverpool': "89172160.20480.0000",
        'Sid': "2016210773",
        'Jsessionid': "3892DCD4F0D2B95656A77CECC667287D",
        'Authorization': "Basic MjAxNjIxMDc3MzowMzA2MTAxNDkwY3J5"
        //'Authorization': "Basic " + btoa("id:password")
      },
      body: data
    });
  },
  editLesson(id, data) {
    return request({
      method: "PUT",
      url: "https://ccnubox.muxixyz.com/api/table/" + id + "/",
      headers: {
        'Bigipserverpool': "89172160.20480.0000",
        'Sid': "2016210773",
        'Jsessionid': "3892DCD4F0D2B95656A77CECC667287D",
        'Authorization': "Basic MjAxNjIxMDc3MzowMzA2MTAxNDkwY3J5"
        //'Authorization': "Basic " + btoa("id:password")
      },
      body: data
    });
  },
  deleteLesson(id) {
    return request({
      method: "DELETE",
      url: "https://ccnubox.muxixyz.com/api/table/" + id + "/",
      headers: {
        'Bigipserverpool': "89172160.20480.0000",
        'Sid': "2016210773",
        'Jsessionid': "3892DCD4F0D2B95656A77CECC667287D",
        'Authorization': "Basic MjAxNjIxMDc3MzowMzA2MTAxNDkwY3J5"
        //'Authorization': "Basic " + btoa("id:password")
      }
    });
  }
};

export default TableService;

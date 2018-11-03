import { createElement, Component, PropTypes, setNativeProps } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import ScrollView from "rax-scrollview";
import PanResponder from "universal-panresponder";
import TableService from "./services/table";
import Modal from "rax-modal";
const native = require("@weex-module/test");
import Header from "./header";
import { parseSearchString } from "../box-ui/util";
import Image from "rax-image";
import Toast from 'universal-toast';

var day = new Date().getDay() - 1; // 本周的第几天,Sunday - Saturday : 0 - 6
if (day == -1) {
  day = 6;
}
var d = day;
var weekDate = [];
var nowDate = new Date();
var temp = nowDate;

for (let i = 0; i < 7; i++) {
  if (i == 0) {
    temp.setDate(temp.getDate() - d);
  } else {
    temp.setDate(temp.getDate() + 1);
  }
  weekDate[i] = temp.getMonth() + 1 + "-" + temp.getDate();
}

const getEmptyCourseArray = () => {
  let emptyCourseArray = new Array(7);
  for (let i = 0; i < 7; i++) {
    emptyCourseArray[i] = new Array(14);
  }
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 14; j++) {
      emptyCourseArray[i][j] = new Array();
    }
  }
  return emptyCourseArray;
};

let qd = {};
// 获取查询参数
if (window.location.search) {
  qd = parseSearchString(window.location.search);
} else {
  alert("参数缺失错误 " + window.location);
}
const STATUS_BAR_HEIGHT = Number(qd.statusBarHeight[0]);
const NAV_BAR_HEIGHT = Number(qd.navBarHeight[0]);
const REFRESH_FLAG = Boolean(Number(qd.refresh[0]));
const START_COUNT_DAY = qd.startCountDay[0];

const TABLE_INITIAL_LEFT = 80;
const TABLE_INITIAL_TOP = (45 + STATUS_BAR_HEIGHT) * 2 + 40 * 2;

const headerStyles = {
  style: {
    height: (45 + STATUS_BAR_HEIGHT) * 2,
    paddingTop: STATUS_BAR_HEIGHT * 2
  }
};
const weekListStyles = {
  style: {
    top: (45 + STATUS_BAR_HEIGHT) * 2
  }
};

// 根据设备高度 算出 top 的边界值。10 是状态栏高度，88 是导航栏高度，45，40，700 是内容区的header，周数，画布的高度。
// 这种算法没有考虑 iPhone X，X 的状态栏高度比较高，但这里没法去判断设备是否是 X，或许可以从 Native 获取。
const TABLE_TOP_LIMIT =
  (TABLE_INITIAL_TOP / 2 -
    Math.abs(
      700 -
        (((screen.height / window.devicePixelRatio) * 375) /
          (screen.width / window.devicePixelRatio) -
          Number(NAV_BAR_HEIGHT) -
          headerStyles.style.height / 2 -
          40)
    )) *
  2;

let ERROR_MESSAGE = "服务端错误，请求课程表失败";

// alert(screen.height / window.devicePixelRatio)
class Table extends Component {
  constructor(props) {
    super(props);
    this.sid = "";
    this.pwd = "";
    this.stuInfo = ""; // Base64(sid:pwd)
    (this.weekData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]),
      (this.order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
      (this.colors = ["#f6b37f", "#f29c9f", "#13b5b1", "#8372D3"]),
      (this.grey = "#8E8E93"),
      (this.weekDay = {
        星期一: 0,
        星期二: 1,
        星期三: 2,
        星期四: 3,
        星期五: 4,
        星期六: 5,
        星期日: 6
      }),
      // (this.lesson = new Map()),
      (this.state = {
        loading: true,
        courseList: [],
        courseArray: getEmptyCourseArray(),
        courseDeleting: {}
      });
    //  保存上一次滑动的坐标
    this._previousLeft = TABLE_INITIAL_LEFT;
    this._previousTop = TABLE_INITIAL_TOP;
    // 画布的坐标状态
    this._tableStyles = {
      style: {
        left: TABLE_INITIAL_LEFT,
        top: TABLE_INITIAL_TOP
      }
    };
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd
    });
    // 左侧时间的滚动位置
    this._orderStyles = {
      style: {
        top: TABLE_INITIAL_TOP
      }
    };
  }

  componentWillMount() {
    this.initCourseData();
    TableService.getErrorMessage().then(res => {
      if (Object.keys(res).length > 0) {
        ERROR_MESSAGE = res.msg;
      }
    });
  }

  reset = () => {
    this.setState({
      courseList: [],
      courseArray: getEmptyCourseArray(),
      courseDeleting: {}
    });
  };

  componentDidMount() {
    // 初始化时设置画布的样式
    this._updateLeft();
    this._updateTop();
  }

  setCourseArray = (res, _CourseArray) => {
    res.map(lesson => {
      let i = this.weekDay[lesson.day];
      let start = parseInt(lesson.start);
      let during = parseInt(lesson.during);

      for (let j = start; j < during + start; j++) {
        if (_CourseArray[i][j - 1] == undefined) {
          _CourseArray[i][j - 1] = [];
        }
        _CourseArray[i][j - 1].push(lesson);
      }
    });
    return _CourseArray;
  };

  getCourseFromServerImpl = options => {
    let _CourseArray = this.state.courseArray;
    TableService.getTableList(options)
      .then(res => {
        native.reportInsightApiEvent("getTableList", "success", "null");
        native.saveCachedTable(JSON.stringify(res));
        this.setState({
          courseArray: this.setCourseArray(res, _CourseArray)
        });
        native.changeLoadingStatus(true);
      })
      .catch(e => {
        native.changeLoadingStatus(true);
        native.reportInsightApiEvent("getTableList", "error", "500");
        alert(ERROR_MESSAGE);
      });
  };

  getCourseFromServer = () => {
    if (!this.checkLogin()) return;
    this.reset();
    native.changeLoadingStatus(false);

    native.getCookie(res => {
      native.reportInsightApiEvent("getCookieForTable", "error", "500");
      // 兜底：如果模拟登陆失败，不带 cookie 请求服务端

      if (res.code === "200") {
        this.getCourseFromServerImpl({
          sid: this.sid,
          token: this.stuInfo,
          cookie: {
            Jsessionid: res.cookieJ,
            Bigipserverpool: res.cookieB
          }
        });
      } else if (res.code === "401") {
        native.changeLoadingStatus(true);
        native.reportInsightApiEvent("getCookieForTable", "error", "401");
        alert(
          "学号或密码错误，请检查是否修改了 one.ccnu.edu.cn 的密码。如修改了密码，请在设置中退出登录后进入课程表重新登录"
        );
      } else {
        this.getCourseFromServerImpl({
          sid: this.sid,
          token: this.stuInfo
        });
      }
    });
  };

  initCourseData = () => {
    // 初始化时拉取 Sid
    native.getStuInfo(res => {
      if (res.code === "200") {
        this.sid = res.sid;
        this.pwd = res.pwd;
        this.stuInfo = btoa(this.sid + ":" + "pwd");
        // URL 传参，强制刷新
        if (REFRESH_FLAG) {
          this.getCourseFromServer();
          return;
        }
        native.getCachedTable(res => {
          if (res.code === "404") {
            this.getCourseFromServer();
          } else {
            let _CourseArray = this.state.courseArray;
            this.setState({
              courseArray: this.setCourseArray(
                JSON.parse(res.result),
                _CourseArray
              )
            });
            native.changeLoadingStatus(true);
          }
        });
      } else {
        native.changeLoadingStatus(true);
        // 理论上不会走到这个分支，因为课程表有登录 guard
        alert("未登录");
      }
    });
  };
  _updateLeft() {
    setNativeProps(this.table, {
      style: {
        left: this._tableStyles.style.left,
        top: this._tableStyles.style.top
      }
    });
    this.scrollView.scrollTo({ x: 80 - this._tableStyles.style.left });
  }

  _updateTop() {
    this._orderStyles.style.top = this._tableStyles.style.top;
    setNativeProps(this.table, {
      style: {
        left: this._tableStyles.style.left,
        top: this._tableStyles.style.top
      }
    });
    setNativeProps(this.orderList, {
      style: {
        top: this._tableStyles.style.top
      }
    });
  }

  _handleStartShouldSetPanResponder(e, gestureState) {
    return true;
  }

  _handleMoveShouldSetPanResponder(e, gestureState) {
    return true;
  }

  _handlePanResponderMove = (e, gestureState) => {
    // 竖直方向滚动
    if (Math.abs(gestureState.dy) >= Math.abs(gestureState.dx)) {
      if (
        // 越界检查，已经到边界不能再拖
        !(
          this._tableStyles.style.top == TABLE_TOP_LIMIT && gestureState.dy < 0
        ) &&
        !(
          this._tableStyles.style.top == TABLE_INITIAL_TOP &&
          gestureState.dy > 0
        )
      ) {
        this._tableStyles.style.top = this._previousTop + gestureState.dy;
        native.log(
          String(this._tableStyles.style.top + " " + String(TABLE_TOP_LIMIT))
        );
        native.log(
          String(screen.height) + " " + String(window.devicePixelRatio)
        );
        // 越界检查，超出边界时 reset
        if (this._tableStyles.style.top <= TABLE_TOP_LIMIT) {
          this._tableStyles.style.top = TABLE_TOP_LIMIT;
        }

        if (this._tableStyles.style.top >= TABLE_INITIAL_TOP) {
          this._tableStyles.style.top = TABLE_INITIAL_TOP;
        }
        this._updateTop();
      }
    } else {
      // 水平方向滚动
      if (
        // 越界检查，已经到边界不能再拖
        !(this._tableStyles.style.left == -50 && gestureState.dx < 0) &&
        !(this._tableStyles.style.left == 80 && gestureState.dx > 0)
      ) {
        this._tableStyles.style.left = this._previousLeft + gestureState.dx;
        // 越界检查，超出边界时 reset
        if (this._tableStyles.style.left <= -50) {
          this._tableStyles.style.left = -50;
        }
        if (this._tableStyles.style.left >= 80) {
          this._tableStyles.style.left = 80;
        }
        this._updateLeft();
      }
    }
  };

  // 更新 previous value 为上一次滑动结束时的坐标
  _handlePanResponderEnd = (e, gestureState) => {
    if (Math.abs(gestureState.dy) >= Math.abs(gestureState.dx)) {
      this._previousTop = this._tableStyles.style.top;
    } else {
      this._previousLeft = this._tableStyles.style.left;
    }
  };

  weekList = (item, index) => {
    return (
      <View
        style={
          day != index
            ? [styles.grid_width, styles.first_row, styles.item_center]
            : [styles.grid_today, styles.first_row, styles.item_center]
        }
      >
        <Text style={[styles.week_text]}>{item}</Text>
        <Text style={[styles.font, { color: this.colors[0] }]}>
          {weekDate[index]}
        </Text>
      </View>
    );
  };

  orderList = item => {
    return (
      <View
        style={[
          styles.order_grid,
          styles.order_width,
          styles.grid_height,
          styles.center
        ]}
      >
        <Text>{item}</Text>
      </View>
    );
  };
  showLesson = list => {
    this.setState({
      courseList: list
    });
    this.refs.lesson.show();
  };

  hideLesson = () => {
    this.refs.lesson.hide();
  };
  inArray = (s, week) => {
    let arr = [];
    arr = s.split(",");
    if (arr.indexOf(week.toString()) != -1) {
      return true;
    }
    return false;
  };

  hasCourse = (arr, week) => {
    // 查看是否有重叠时间的课
    let result = {
      course: arr[0],
      flag: false
    };
    let count = 0;
    arr.map(item => {
      if (this.inArray(item.weeks, week)) {
        result.flag = true;
        result.course = item;
        count++;
      }
    });
    // 重复选课的特殊情况，可能会覆盖，选节数比较短的课显示
    if (count > 1) {
      arr.map(item => {
        if (
          this.inArray(item.weeks, week) &&
          parseInt(item.during) <= parseInt(result.course.during)
        ) {
          result.course = item;
        }
      });
    }
    return result;
  };

  showDelete = (length, course) => {
    if (length === 1) {
      this.setState({
        courseDeleting: course
      });
      this.refs.deleteModal.show();
    }
  };

  checkLogin = () => {
    if (this.sid === "" || this.pwd === "") {
      alert("未登录");
      return false;
    }
    return true;
  };

  deleteCourse = () => {
    if (!this.checkLogin()) return;

    let options = {
      id: this.state.courseDeleting.id,
      sid: this.sid,
      pwd: this.pwd,
      stuInfo: btoa(this.sid + ":" + this.pwd)
    };
    TableService.deleteLesson(options)
      .then(res => {
        this.refs.lesson.hide();
        this.refs.deleteModal.hide();
        Toast.show("删除课程成功！", Toast.SHORT);
        this.getCourseFromServer();
      })
      .catch(e => {
        this.refs.lesson.hide();
        this.refs.deleteModal.hide();
        native.reportInsightApiEvent("deleteCourse", "error", JSON.stringify(e));
        alert("删除课程失败，请重试");
      });
  };

  calcWeek = weeks => {
    let arr = weeks.split(",").map(i => {
      return parseInt(i);
    });
    arr.sort(function(a, b) {
      return a - b;
    });
    let isOdd = true;
    let isEven = true;
    arr.map(n => {
      if (n % 2 !== 0) {
        isEven = false;
      }
      if (n % 2 !== 1) {
        isOdd = false;
      }
    });

    // 判断是否连续周上课， 若为否则不为“单双全”的连续周显示，而是显示所有周数 weeks
    let len = arr.length;

    // 连续单或双周
    if ((isOdd || isEven) && (arr[len - 1] - arr[0]) / 2 + 1 === len) {
      return isOdd
        ? arr[0] + "-" + arr[len - 1] + "周（单）"
        : arr[0] + "-" + arr[len - 1] + "周（双）";
    }
    // 连续所有周
    if (!isEven && !isOdd && arr[len - 1] - arr[0] + 1 === len) {
      return arr[0] + "-" + arr[len - 1] + "周";
    }

    // 非连续周
    return weeks + "周";
  };

  renderTableCanvas = () => {
    return (
      <View
        style={[styles.lesson_table]}
        ref={table => {
          this.table = table;
        }}
        {...this._panResponder.panHandlers}
      >
        {this.state.courseArray.map((column, index) => {
          return (
            <View
              style={
                day == index
                  ? [styles.lesson_column, styles.grid_today]
                  : [styles.lesson_column, styles.grid_width]
              }
            >
              {column.map((list, i) => {
                if (list.length > 0) {
                  let flag = this.hasCourse(list, this.props.currentWeek).flag;
                  let item = this.hasCourse(list, this.props.currentWeek)
                    .course;
                  // 如果不加list.length == 1 && flag == false，会出现有课但是由于不是当前周、开始节而不显示
                  // i === parseInt(item.start) - 1是防止后面的课因节数较多而把重叠的节数少的另一门课覆盖
                  if (
                    i === parseInt(item.start) - 1 ||
                    (list.length === 1 && flag === false)
                  ) {
                    return (
                      <View
                        style={[
                          styles.item_center,
                          styles.daily_lesson,
                          {
                            width: this.weekDay[item.day] == day ? 200 : 100,
                            height: parseInt(item.during) * 100,
                            position: "absolute",
                            top: (parseInt(item.start) - 1) * 100
                          }
                        ]}
                      >
                        <Touchable
                          onPress={() => this.showLesson(list)}
                          delayPressIn={400}
                          delayPressOut={1000}
                          delayLongPress={800}
                          onLongPress={() => this.showDelete(list.length, item)}
                          style={[
                            styles.lesson_grid_center,
                            {
                              justifyContent:
                                list.length > 1 ? "space-between" : "center",
                              height: parseInt(item.during) * 100
                            }
                          ]}
                        >
                          {list.length > 1 && <View />}
                          <View>
                            <View
                              style={[
                                styles.item_center,
                                styles.lesson_item,
                                {
                                  backgroundColor: flag
                                    ? this.colors[parseInt(item.color)]
                                    : this.grey,
                                  width: index == day ? 188 : 88
                                }
                              ]}
                            >
                              {flag ? (
                                <Text style={[styles.course_text, styles.font]}>
                                  {item.course}
                                </Text>
                              ) : (
                                <Text style={[styles.course_text, styles.font]}>
                                  {item.course}
                                  (非本周)
                                </Text>
                              )}
                            </View>
                            <View
                              style={[styles.item_center, styles.course_info]}
                            >
                              <Text style={[styles.font]}>{item.teacher}</Text>
                              <Text style={[styles.font, styles.grey_font]}>
                                @{item.place}
                              </Text>
                            </View>
                          </View>
                          {list.length > 1 && (
                            <Image
                              source={require("./assets/mark.png")}
                              resizeMode="cover"
                              style={[
                                styles.more,
                                {
                                  marginLeft:
                                    this.weekDay[item.day] == day ? 178 : 78
                                }
                              ]}
                            />
                          )}
                        </Touchable>
                      </View>
                    );
                  }
                } else {
                  return (
                    <View
                      style={[
                        {
                          width: index == day ? 200 : 100,
                          position: "absolute",
                          top: i * 100
                        },
                        styles.daily_lesson,
                        styles.grid_height
                      ]}
                    />
                  );
                }
              })}
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    return (
      <View>
        {this.renderTableCanvas()}
        <View
          ref={orderList => {
            this.orderList = orderList;
          }}
          style={[styles.column, styles.grid_width, this._orderStyles.style]}
        >
          {this.order.map(i => {
            return (
              <View
                style={[
                  styles.order_grid,
                  styles.order_width,
                  styles.grid_height,
                  styles.center
                ]}
              >
                <Text>{i}</Text>
              </View>
            );
          })}
        </View>
        <View style={[styles.week_row, styles.first_row, weekListStyles.style]}>
          <View style={[styles.order_width, styles.first_row]} />
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            style={[styles.week_data]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {this.weekData.map(this.weekList)}
          </ScrollView>
        </View>
        <Modal
          ref="lesson"
          contentStyle={[
            styles.lesson_modal,
            {
              height: 250 * this.state.courseList.length - 50
            }
          ]}
        >
          {this.state.courseList.map(course => {
            return (
              <Touchable
                onPress={this.hideLesson}
                delayPressIn={400}
                delayPressOut={1000}
                delayLongPress={800}
                onLongPress={() => this.showDelete(1, course)}
              >
                <View style={[styles.item_center, styles.modal_cards]}>
                  <Text
                    style={[
                      styles.modal_font,
                      styles.modal_course,
                      {
                        color: this.colors[course.color]
                      }
                    ]}
                  >
                    {course.course}
                  </Text>
                  <Text style={[styles.modal_font]}>{course.teacher}</Text>
                  <Text style={[styles.modal_font]}>
                    {this.calcWeek(course.weeks)}
                  </Text>
                  <Text style={[styles.modal_font]}>@{course.place}</Text>
                </View>
              </Touchable>
            );
          })}
        </Modal>
        <Modal
          ref="deleteModal"
          contentStyle={[
            styles.delete_modal,
            styles.item_center,
            {
              bottom: NAV_BAR_HEIGHT * 2
            }
          ]}
        >
          <Touchable
            onPress={this.deleteCourse}
            style={[styles.delete_course, styles.delete_button, styles.center]}
          >
            <Text style={[styles.delete_text, styles.confirm_delete]}>
              删除
              {this.state.courseDeleting.course}
            </Text>
          </Touchable>
          <Touchable
            onPress={() => this.refs.deleteModal.hide()}
            style={[styles.cancel_delete, styles.delete_button, styles.center]}
          >
            <Text style={[styles.delete_text, styles.cancel_text]}>取消</Text>
          </Touchable>
        </Modal>
      </View>
    );
  }
}

function diff_weeks(dt1, dt2) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  if (diff < 0) return 0;
  diff /= 60 * 60 * 24 * 7;

  return Math.abs(Math.ceil(diff));
}

// 根据当前日期和学期初始日期，得出当前周数
// FIX: startDate 从 0:00 开始
// FIX: startDate 月份要加0
// FIX: 可以考虑使用 moment 库
const calCurrentWeek = () => {
  let currentDate = new Date();
  let startDate = new Date(START_COUNT_DAY);
  return diff_weeks(startDate, currentDate);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeek: calCurrentWeek()
    };
  }
  changeWeektoTable = week => {
    this.setState({
      currentWeek: week
    });
  };

  render() {
    return (
      <Touchable
        style={styles.app}
        onPress={() => {
          this.refs.header.hideWeekModal();
        }}
      >
        <Table ref="table" currentWeek={this.state.currentWeek} />
        <Header
          ref="header"
          currentWeek={this.state.currentWeek}
          headerStyles={headerStyles}
          changeWeek={week => this.changeWeektoTable(week)}
          btnStyle={{
            top: STATUS_BAR_HEIGHT * 2 + 45 / 2
          }}
          dropdownStyle={{
            top: STATUS_BAR_HEIGHT * 2 + 100 / 2
          }}
        />
        <Touchable
          onPress={() => {
            this.refs.table.getCourseFromServer();
          }}
          style={[
            styles.header_refresh,
            {
              top: STATUS_BAR_HEIGHT * 2 + 45 / 2
            }
          ]}
        >
          <Text style={[styles.fresh_text]}>刷新课表</Text>
        </Touchable>
      </Touchable>
    );
  }
}

export default App;

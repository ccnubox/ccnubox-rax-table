import { createElement, Component } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./add.css";
import TableService from "./services/table";
import Touchable from "rax-touchable";
import ScrollView from "rax-scrollview";
import TextInput from "rax-textinput";
import BoxButton from "../box-ui/common/button";
import Modal from "rax-modal";
import { parseSearchString } from "../box-ui/util";
const native = require("@weex-module/test");
import Toast from "universal-toast";

let qd = {};
// 获取查询参数
if (window.location.search) {
  qd = parseSearchString(window.location.search);
} else {
  alert("参数缺失错误 " + window.location);
}
const SID = qd.sid[0];

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacher: "",
      course: "",
      weeks: "",
      day: 0,
      during: 2,
      place: "",
      startTime: 1,
      endTime: 2,
      weeksArray: [],
      weekMap: [],
      weekVisible: false,
      timeVisible: false,
      choosingOdd: false,
      choosingEven: false,
      choosingAll: false,
      timeHasValue: false
    };
    (this.weeks = []),
      (this.weekdays = [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ]),
      (this.timeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  }
  componentWillMount() {
    let tempArr = new Array(24);
    for (let i = 0; i < 24; i++) {
      tempArr[i] = false;
    }
    this.setState({
      weekMap: tempArr
    });
    for (let i = 0; i < 4; i++) {
      this.weeks[i] = [];
    }
    for (let i = 0; i <= 3; i++) {
      for (let j = 1; j <= 6; j++) {
        this.weeks[i].push(i * 6 + j);
      }
    }
  }

  componentDidMount() {}

  handleAuthError = e => {
    const data = JSON.parse(e.data);
    if (data.code === 20104) {
      alert(
        "学号或密码错误，请检查是否修改了 one.ccnu.edu.cn 的密码。如修改了密码，请在设置中退出登录后进入课程表重新登录"
      );
    } else {
      alert("服务端错误：401");
    }
  };

  onCourseChange = event => {
    this.setState({
      course: event.nativeEvent.text
    });
  };

  onTeacherChange = event => {
    this.setState({
      teacher: event.nativeEvent.text
    });
  };

  onPlaceChange = event => {
    this.setState({
      place: event.nativeEvent.text
    });
  };

  showWeek = () => {
    this.refs.weekModal.show();
  };

  hideWeek = () => {
    this.refs.weekModal.hide();
  };

  showTime = () => {
    this.refs.timeModal.show();
  };

  hideTime = () => {
    this.refs.timeModal.hide();
  };
  confirmWeek = () => {
    this.refs.weekModal.hide();
    let tempArr = [];
    for (let i = 0; i < 24; i++) {
      if (this.state.weekMap[i]) {
        tempArr.push(i + 1);
      }
    }
    this.setState({
      weeksArray: tempArr
    });
  };
  chooseOddWeeks = () => {
    let tempMap = [];
    for (let i = 0; i < 24; i++) {
      i % 2 ? (tempMap[i] = false) : (tempMap[i] = true);
    }
    this.setState({
      weekMap: tempMap,
      choosingOdd: true,
      choosingEven: false,
      choosingAll: false
    });
  };
  chooseEvenWeeks = () => {
    let tempMap = [];
    for (let i = 0; i < 24; i++) {
      i % 2 ? (tempMap[i] = true) : (tempMap[i] = false);
    }
    this.setState({
      weekMap: tempMap,
      choosingEven: true,
      choosingOdd: false,
      choosingAll: false
    });
  };
  chooseAllWeeks = () => {
    let tempMap = [];
    for (let i = 0; i <= 23; i++) {
      tempMap[i] = true;
    }
    this.setState({
      weekMap: tempMap,
      choosingAll: true,
      choosingOdd: false,
      choosingEven: false
    });
  };
  chooseOneWeek = i => {
    let tempMap = this.state.weekMap;
    tempMap[i] = !tempMap[i];
    this.setState({
      weekMap: tempMap
    });
  };

  chooseDay = day => {
    this.setState({
      day
    });
  };

  chooseStart = (item, index) => {
    this.setState({
      startTime: item
    });
  };

  chooseEnd = (item, index) => {
    this.setState({
      endTime: item
    });
  };
  confirmTime = () => {
    if (this.state.startTime > this.state.endTime) {
      this.refs.tipModal.show();
    } else {
      this.refs.timeModal.hide();
      this.setState({
        timeHasValue: true
      });
    }
  };
  confirmAdd = () => {
    if (
      this.state.course === "" ||
      this.state.teacher === "" ||
      this.state.weeksArray.length === 0 ||
      this.state.place === ""
    ) {
      alert("请输入完整的信息");
      return;
    }
    let course = {
      course: this.state.course,
      teacher: this.state.teacher,
      weeks: this.state.weeksArray,
      day: String(this.state.day + 1),
      start: String(this.state.startTime),
      during: String(this.state.endTime - this.state.startTime + 1),
      place: this.state.place
    };
    native.getStuInfo(res => {
      if (res.code === "200") {
        const stuInfo = btoa(res.sid + ":" + res.pwd);
        TableService.addLessonV2(course, stuInfo)
          .then(res => {
            Toast.show("添加课程成功！", Toast.SHORT);
            native.backToTableMain();
          })
          .catch(e => {
            if (e.status === 401) {
              this.handleAuthError(e);
              native.backToTableMain();
              return;
            }
            native.reportInsightApiEvent("addCourse", "error", e.code);
            alert("添加课程错误，请重试");
            native.backToTableMain();
          });
      } else {
        // 理论上不会走到这个分支，因为课程表有登录 guard
        alert("未登录");
      }
    });
  };
  render() {
    return (
      <View style={styles.app}>
        <View style={[styles.box, styles.info_box]}>
          <TextInput
            placeholder="请输入课程名称"
            value={this.state.course}
            style={[styles.input_box]}
            onInput={this.onCourseChange}
            onChange={this.onCourseChange}
          />
          <TextInput
            placeholder="请输入任教教师"
            value={this.state.teacher}
            style={[styles.input_box]}
            onInput={this.onTeacherChange}
            onChange={this.onTeacherChange}
          />
        </View>
        <Text style={[styles.time]}>上课时间</Text>
        <View style={[styles.box, styles.time_box]}>
          <Touchable
            onPress={this.showWeek}
            style={[styles.input_box, styles.time_choose]}
          >
            <Text style={[styles.input_word, styles.center, styles.time_word]}>
              {this.state.weeksArray.length === 0
                ? "选择上课周次"
                : "修改上课周次"}
            </Text>
          </Touchable>
          <Touchable
            onPress={this.showTime}
            style={[styles.input_box, styles.time_choose]}
          >
            <Text style={[styles.input_word, styles.center, styles.time_word]}>
              {this.state.timeHasValue
                ? `时间: ${this.weekdays[this.state.day]} ${
                    this.state.startTime
                  }-${this.state.endTime}  点击修改`
                : "选择上课时间"}
            </Text>
          </Touchable>
          <TextInput
            placeholder="请输入上课地点"
            value={this.state.place}
            style={[styles.input_box]}
            onInput={this.onPlaceChange}
            onChange={this.onPlaceChange}
          />
        </View>
        <View>
          <BoxButton
            onPress={() => {
              this.confirmAdd();
            }}
            width={550}
            style={{ marginTop: 48 }}
            textStyle={{ color: "#fff", fontSize: 32 }}
            text="完成"
          />
        </View>
        <Modal ref="weekModal" contentStyle={[styles.modal]}>
          <View style={[styles.modal_header, styles.center]}>
            <Touchable onPress={this.hideWeek}>
              <Text style={[styles.purple_text]}>取消</Text>
            </Touchable>
            <Touchable onPress={this.confirmWeek}>
              <Text style={[styles.purple_text]}>确认</Text>
            </Touchable>
          </View>
          <View style={[styles.choose_cont, styles.center]}>
            <View style={[styles.choose_week]}>
              <View
                style={[
                  styles.table_header,
                  styles.table_row,
                  styles.row_height,
                  styles.center,
                  {
                    backgroundColor: this.state.choosingOdd
                      ? "#6767fa"
                      : "#ffffff"
                  }
                ]}
              >
                <Touchable
                  onPress={this.chooseOddWeeks}
                  style={[styles.equal_div, styles.center, styles.border_right]}
                >
                  <View style={[styles.table_row, styles.center]}>
                    <Text
                      style={[
                        {
                          color: this.state.choosingOdd ? "#ffffff" : "#6767fa"
                        }
                      ]}
                    >
                      单周
                    </Text>
                  </View>
                </Touchable>
                <Touchable
                  onPress={this.chooseEvenWeeks}
                  style={[
                    styles.equal_div,
                    styles.center,
                    styles.border_right,
                    {
                      backgroundColor: this.state.choosingEven
                        ? "#6767fa"
                        : "#ffffff"
                    }
                  ]}
                >
                  <View style={[styles.table_row, styles.center]}>
                    <Text
                      style={[
                        {
                          color: this.state.choosingEven ? "#ffffff" : "#6767fa"
                        }
                      ]}
                    >
                      双周
                    </Text>
                  </View>
                </Touchable>
                <Touchable
                  onPress={this.chooseAllWeeks}
                  style={[
                    styles.equal_div,
                    styles.center,
                    styles.row_height,
                    {
                      backgroundColor: this.state.choosingAll
                        ? "#6767fa"
                        : "#ffffff"
                    }
                  ]}
                >
                  <View style={[styles.table_row, styles.center]}>
                    <Text
                      style={[
                        {
                          color: this.state.choosingAll ? "#ffffff" : "#6767fa"
                        }
                      ]}
                    >
                      全选
                    </Text>
                  </View>
                </Touchable>
              </View>
              <View style={[styles.border_left]}>
                {this.weeks.map((row, rowIndex) => {
                  return (
                    <View style={[styles.table_row, styles.center]}>
                      {row.map((item, itemIndex) => {
                        return (
                          <Touchable
                            onPress={() => {
                              this.chooseOneWeek(item - 1);
                            }}
                            style={[
                              styles.border_right,
                              styles.equal_div,
                              styles.row_item,
                              {
                                backgroundColor: this.state.weekMap[item - 1]
                                  ? "#feb75a"
                                  : "#ffffff"
                              }
                            ]}
                          >
                            <Text>{item}</Text>
                          </Touchable>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
        <Modal ref="timeModal" contentStyle={[styles.modal]}>
          <View style={[styles.modal_header, styles.center]}>
            <Touchable onPress={this.hideTime}>
              <Text style={[styles.purple_text]}>取消</Text>
            </Touchable>
            <Touchable onPress={this.confirmTime}>
              <Text style={[styles.purple_text]}>确认</Text>
            </Touchable>
          </View>
          <View style={[styles.center, styles.time_cont]}>
            <ScrollView
              ref={scrollView => {
                this.WeekScrollView = scrollView;
              }}
              style={[styles.time_scroll]}
              showsVerticalScrollIndicator={false}
            >
              {this.weekdays.map((day, index) => {
                return (
                  <Touchable
                    onPress={() => {
                      this.chooseDay(index);
                    }}
                    style={[styles.time_item, styles.center]}
                  >
                    <Text
                      style={{
                        fontSize: this.state.day === index ? 35 : 30,
                        color: this.state.day === index ? "#6767fa" : "#000000"
                      }}
                    >
                      {day}
                    </Text>
                  </Touchable>
                );
              })}
            </ScrollView>
            <ScrollView
              ref={scrollView => {
                this.StartScrollView = scrollView;
              }}
              style={[styles.time_scroll]}
              showsVerticalScrollIndicator={false}
            >
              {this.timeArr.map((item, index) => {
                return (
                  <Touchable
                    onPress={() => {
                      this.chooseStart(item, index);
                    }}
                    style={[styles.time_item, styles.center]}
                  >
                    <Text
                      style={{
                        fontSize: this.state.startTime === item ? 35 : 30,
                        color:
                          this.state.startTime === item ? "#6767fa" : "#000000"
                      }}
                    >
                      {item}
                    </Text>
                  </Touchable>
                );
              })}
            </ScrollView>
            <ScrollView
              ref={scrollView => {
                this.EndScrollView = scrollView;
              }}
              style={[styles.time_scroll]}
              showsVerticalScrollIndicator={false}
            >
              {this.timeArr.map((item, index) => {
                return (
                  <Touchable
                    onPress={() => {
                      this.chooseEnd(item, index);
                    }}
                    style={[styles.time_item, styles.center]}
                  >
                    <Text
                      style={{
                        fontSize: this.state.endTime === item ? 35 : 30,
                        color:
                          this.state.endTime === item ? "#6767fa" : "#000000"
                      }}
                    >
                      到 {item}
                    </Text>
                  </Touchable>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
        <Modal
          ref="tipModal"
          contentStyle={[styles.tip_modal, styles.column_center]}
        >
          <View style={[styles.column_center, styles.modal_title]}>
            <Text style={styles.bold_text}>提示</Text>
            <Text style={styles.tip_content}>请输入正确的课程时间</Text>
          </View>
          <Touchable
            onPress={() => {
              this.refs.tipModal.hide();
            }}
            style={[styles.column_center, styles.confirm]}
          >
            <Text style={styles.blue_text}>确定</Text>
          </Touchable>
        </Modal>
      </View>
    );
  }
}

export default Add;

import { createElement, Component, PropTypes, setNativeProps } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import Button from "rax-button";
import Image from "rax-image";
import ScrollView from "rax-scrollview";
import moment from "moment";
const native = require("@weex-module/test");
import { parseSearchString } from "../box-ui/util";

let qd = {};
// 获取查询参数
if (window.location.search) {
  qd = parseSearchString(window.location.search);
} else {
  alert("参数缺失错误 " + window.location);
}

const START_COUNT_DAY = new Date(qd.startCountDay[0]);
const START_COUNT_DAY_PRESET = new Date(qd.startCountDayPreset[0]);

class Header extends Component {
  constructor(props) {
    super(props);
    this.WeekOptions = [];
    this.state = {
      currentWeek: this.props.currentWeek, // 当前周
      choosedWeek: this.props.currentWeek, // 临时变量，用户改变当前周但没有保存时的当前周数
      showsVerticalScrollIndicator: false,
      isShow: false,
      confirm: false,
      termBegin: false
    };
  }
  componentWillMount() {
    for (let i = 1; i <= 35; i++) {
      this.WeekOptions.push(i);
    }
    if (START_COUNT_DAY < Date.now()) {
      this.setState({
        termBegin: true
      });
    }
  }

  showWeekModal = () => {
    this.setState({
      isShow: !this.state.isShow
    });
  };

  hideWeekModal = () => {
    this.setState({
      isShow: false
    });
  };

  confirmChange = () => {
    // 设置未开学为当前周，重置 startCountDay
    if (this.state.choosedWeek === 0) {
      this.setState({
        currentWeek: this.state.choosedWeek,
        confirm: true,
        termBegin: true,
        isShow: false
      });
      native.clearStartCountDay();
      return;
    }

    // 推算出当前周对应的 startCountDay
    // 1.找到当前周一
    let currDate = moment();
    let currDay = currDate.day();
    let currMonday;
    if (currDay === 0) {
      currMonday = currDate.subtract(6, "days");
    } else {
      currMonday = currDate.subtract(currDay - 1, "days");
    }

    // 2.找到x周前的周一
    let startCountDay = currMonday.subtract(
      (this.state.choosedWeek - 1) * 7,
      "days"
    );

    native.saveStartCountDay(startCountDay.format("YYYY-MM-DD"));

    this.setState({
      currentWeek: this.state.choosedWeek,
      confirm: true,
      termBegin: true,
      isShow: false
    });
    this.props.changeWeek(this.state.choosedWeek);
  };

  choosingWeek = index => {
    this.setState({
      choosedWeek: index + 1,
      confirm: false,
      termBegin: true
    });
    this.props.changeWeek(index + 1);
  };

  // 点击未开学，设置 chooseWeek 为 0
  resetChooseWeek = () => {
    this.setState({
      confirm: false,
      termBegin: false,
      choosedWeek: 0
    });
    this.props.changeWeek(0);
  };

  render() {
    return (
      <View>
        <View
          style={[styles.header, styles.center, this.props.headerStyles.style]}
        >
          <Touchable
            onPress={this.showWeekModal}
            style={[styles.choose_label, styles.center]}
          >
            {this.state.choosedWeek === 0 ? (
              <Text style={styles.choose_text}>未开学</Text>
            ) : (
              <Text style={styles.choose_text}>
                第{this.state.choosedWeek}周
              </Text>
            )}
            <Image
              style={styles.down_triangle}
              source={require("./assets/triangle_down.png")}
              resizeMode="cover"
            />
          </Touchable>
          {this.state.isShow ? (
            <View style={[styles.dropdown_container, this.props.dropdownStyle]}>
              <View>
                <Image
                  style={styles.up_triangle}
                  source={require("./assets/triangle_up.png")}
                  resizeMode="cover"
                />
                <View style={[styles.list_container]}>
                  <ScrollView
                    ref={scrollView => {
                      this.scrollView = scrollView;
                    }}
                    style={styles.dropdown_list}
                  >
                    {START_COUNT_DAY_PRESET > new Date() && (
                      <View style={styles.option_container}>
                        <Touchable
                          onPress={() => {
                            this.resetChooseWeek();
                          }}
                          style={[
                            styles.option_item,
                            styles.center,
                            {
                              backgroundColor: this.state.termBegin
                                ? "#ffffff"
                                : "#D7D8D9"
                            }
                          ]}
                        >
                          {this.state.currentWeek === 0 && (
                            <View style={[styles.equal_item]} />
                          )}
                          <Text style={styles.option_text}>未开学</Text>
                          {this.state.currentWeek === 0 && (
                            <Text
                              style={[
                                styles.equal_item,
                                styles.font,
                                styles.current
                              ]}
                            >
                              当前
                            </Text>
                          )}
                        </Touchable>
                      </View>
                    )}
                    {this.WeekOptions.map((item, index) => {
                      return (
                        <View style={styles.option_container}>
                          <View
                            style={[
                              styles.center,
                              styles.option_item,
                              {
                                backgroundColor:
                                  this.state.choosedWeek == index + 1
                                    ? "#D7D8D9"
                                    : "#ffffff"
                              }
                            ]}
                            onClick={() => {
                              this.choosingWeek(index);
                            }}
                          >
                            {this.state.currentWeek == index + 1 && (
                              <View style={[styles.equal_item]} />
                            )}
                            <Text
                              style={[styles.option_text, styles.option_size]}
                            >
                              第{this.WeekOptions[index]}周
                            </Text>
                            {this.state.currentWeek == index + 1 && (
                              <Text
                                style={[
                                  styles.equal_item,
                                  styles.font,
                                  styles.current
                                ]}
                              >
                                当前
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                  <View style={[styles.center]}>
                    <Button
                      onPress={() => this.confirmChange()}
                      style={[styles.set_button, styles.center]}
                    >
                      <Text style={[styles.button_text, styles.option_size]}>
                        设为当前周
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          <View style={[styles.add, this.props.btnStyle]}>
            <Touchable
              onPress={() => {
                native.getStuInfo(res => {
                  if (res.code === "200") {
                    let sid = res.sid;
                    native.push(`ccnubox://table.add?sid=${sid}`);
                  } else {
                    // 理论上不会走到这个分支，因为课程表有登录 guard
                    alert("请登录");
                  }
                });
              }}
            >
              <Text style={[styles.fresh_text]}>添课</Text>
            </Touchable>
          </View>
        </View>
      </View>
    );
  }
}

export default Header;

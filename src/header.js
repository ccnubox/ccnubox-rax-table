import { createElement, Component, PropTypes, setNativeProps } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import ListView from "rax-listview";
import Button from "rax-button";
import Image from "rax-image";
import ScrollView from "rax-scrollview";
import PanResponder from "universal-panresponder";
import TableService from "./services/table";
import Modal from "rax-modal";
import Link from "rax-link";

var initWeek = 0;
var startTerm = new Date(2018, 8, 1);

class Header extends Component {
  constructor(props) {
    super(props);
    this.WeekOptions = [];
    this.state = {
      currentWeek: initWeek, // 当前周
      choosedWeek: initWeek, // 设为当前周
      showsVerticalScrollIndicator: false,
      isShow: false,
      confirm: false,
      termBegin: false
    };
  }
  componentWillMount() {
    for (let i = 1; i <= 24; i++) {
      this.WeekOptions.push(i);
    }
    if (startTerm < Date.now()) {
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
    this.setState({
      currentWeek: this.state.choosedWeek,
      confirm: true,
      termBegin: true,
      isShow: false
    });
    this.props.changeWeek(this.state.currentWeek);
  };

  choosingWeek = index => {
    this.setState({
      choosedWeek: index + 1,
      confirm: false,
      termBegin: true
    });
    this.props.changeWeek(this.state.choosedWeek);
  };

  termBegan = () => {
    this.setState({
      termBegin: false,
      currentWeek: 0,
      choosedWeek: 0
    });
  };

  render() {
    return (
      <View>
        <View style={[styles.header, styles.center]}>
          <Touchable
            onPress={this.showWeekModal}
            style={[styles.choose_label, styles.center]}
          >
            {startTerm > Date.now() && this.state.choosedWeek === 0 ? (
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
            <View style={styles.dropdown_container}>
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
                    {startTerm > Date.now() && (
                      <View style={styles.option_container}>
                        <Touchable
                          onPress={() => {
                            this.termBegan();
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
          <View style={styles.add}>
            <Link
              href="http://10.193.44.188:9999/js/second.bundle.js?_wx_tpl=http://10.193.44.188:9999/js/second.bundle.js"
              style={[styles.fresh_text]}
            >
              添课
            </Link>
          </View>
        </View>
      </View>
    );
  }
}

export default Header;
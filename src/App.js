import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import ListView from "rax-listview";
// import GradeService from "./services/grade";
import Animated from "rax-animated";
//import BoxButton from "../box-ui/common/button";
import Button from "rax-button";
import Image from "rax-image";
import ScrollView from "rax-scrollview";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.fadeAnim = new Animated.Value(0);
  }

  static propTypes = {
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    visible: PropTypes.bool
  };

  static defaultProps = {
    visible: false
  };

  state = {
    visible: false
  };

  animated(state, callback) {
    const { visible, value } = state;
    Animated.timing(this.fadeAnim, { toValue: visible === true ? 1 : 0 }).start(
      callback
    );
  }

  show() {
    const currentState = { visible: true };
    this.setState(currentState, () =>
      this.animated(
        currentState,
        () => this.props.onShow && this.props.onShow(currentState)
      )
    );
  }

  hide() {
    const currentState = { visible: false };
    this.animated(currentState, () =>
      this.setState(
        currentState,
        () => this.props.onHide && this.props.onHide(currentState)
      )
    );
  }

  toggle(visible) {
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.visible != this.props.visible &&
      nextProps.visible != this.state.visible
    ) {
      this.toggle(nextProps.visible);
    }
  }

  componentWillMount() {
    this.setState({
      visible: this.props.visible
    });
  }

  componentDidMount() {
    this.animated(this.state);
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      visible && (
        <AnimatedView
          onClick={() => {
            this.hide();
          }}
          style={styles.center}
        >
          <Touchable>{children}</Touchable>
        </AnimatedView>
      )
    );
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.weekOptions = this.weekOPt(20);// week
    this.state = {
      value: week,
      showsVerticalScrollIndicator: false,
      chooseWeek: { value: 1, text: "第一周" }
    };
  }
  weekOPt(n) {
    let arr = [];
    let i = 1;
    week = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九","二十"]
    while (i <= n) {
      arr[i] = {
        value: i,
        text: "第" + week[i] + "周"
      }
    }
    return arr;
  }
  render() {
    return (
      <View>
        <Dropdown ref="weekModal">
        <ScrollView 
        ref={scrollView => {
          this.scrollView = scrollView;
        }}
        style={styles.dropdown_list}>
        <View
          style={[styles.select_item, styles.item_border]}
          onClick={() => {
            this.hideYearModal(year);
          }}
        >
          <Text style={styles.item_text}>
            {this.weekOptions.map((item) => {
              return (
                <Text>{item.text}</Text>
              )
            })}
          </Text>
        </View>
        </ScrollView>
        </Dropdown>
      </View>
    );
  }
}

class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <View style={styles.appHeader}>
          <Text style={styles.appBanner}>Welcome to Rax</Text>
        </View>
        <Text style={styles.appIntro}>
          To get started, edit src/App.js and save to reload.
        </Text>
      </View>
    );
  }
}

export default App;

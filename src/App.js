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

const { View: AnimatedView } = Animated;

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
          style={[styles.center]}
        >
          <Touchable>{children}</Touchable>
        </AnimatedView>
      )
    );
  }
}
var week = 1;
class Header extends Component {
  constructor(props) {
    super(props);
    this.WeekOptions =  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九","二十"];
    this.state = {
      currentWeek: week, // 当前周
      choosedWeek: week, // 设为当前周
      showsVerticalScrollIndicator: false,
      chooseOnblur: false
    };
  }

  showWeekModal = () => {
    this.refs.weekModal.show();
    // this.setState({
      
    // })
  };

  hideWeekModal = index => {
    this.setState({
      currentWeek: index + 1
    });
    this.refs.weekModal.hide();
  };

  chooseWeek = index => {
    // 
  };

  render() {
    return (
      <View>
        <View style={[styles.header, styles.center]}>
        <Touchable
            onPress={this.showWeekModal}
            style={[styles.choose_label, styles.center]}
          >
            <Text>第{this.state.choosedWeek}周</Text>
            <Image
              style={styles.down_triangle}
              source={require("./assets/triangle_down.png")}
              resizeMode="cover"
            />
          </Touchable>
        <View style={styles.dropdown_container}>
        <Dropdown ref="weekModal">
        <ScrollView 
        ref={scrollView => {
          this.scrollView = scrollView;
        }}
        style={styles.dropdown_list}
        >
            {this.WeekOptions.map((item, index) => {
              return (
                <View
                  style={[styles.option_item, styles.center]}
                  onClick={() => {
                    this.chooseWeek(index);
                  }}
                >
                  <Text style={styles.option_text}>
                    第{this.WeekOptions[index]}周
                  </Text>
                </View>
              )
            })}
        </ScrollView>
        <Button onPress={() => this.changeWeek()} style={[styles.set_button]}>
          <Text style={[styles.button_text]}>设为当前周</Text>
        </Button>
        </Dropdown>
        </View>
        </View>
      </View>
    );
  }
}

class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <Header></Header>
      </View>
    );
  }
}

export default App;

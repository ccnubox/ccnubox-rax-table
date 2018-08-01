import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import ListView from "rax-listview";
import Animated from "rax-animated";
//import BoxButton from "../box-ui/common/button";
import Button from "rax-button";
import Image from "rax-image";
import ScrollView from "rax-scrollview";
import PanResponder from 'universal-panresponder';
import TableService from './services/table';

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
      isShow: false
    };
  }

  showWeekModal = () => {
    if (!this.state.isShow) {
      this.refs.weekModal.show();
    }
    else {
      this.refs.weekModal.hide();
    }
    this.setState({
      isShow: !this.state.isShow
    })
  };

  hideWeekModal = () => {
    this.setState({
      currentWeek: this.state.choosedWeek
    });
    this.refs.weekModal.hide();
  };
  
  choosingWeek = (index) => {
    this.setState({
      choosedWeek: index + 1
    });
  }

  render() {
    return (
      <View>
        <View style={[styles.header, styles.center]}>
          <Touchable
            onPress={this.showWeekModal}
            style={[styles.choose_label, styles.center]}
          >
            <Text style={styles.choose_text}>第{this.state.choosedWeek}周</Text>
            <Image
              style={styles.down_triangle}
              source={require("./assets/triangle_down.png")}
              resizeMode="cover"
              />        
          </Touchable>
        <View style={styles.dropdown_container}>
          <Dropdown ref="weekModal"> 
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
                {this.WeekOptions.map((item, index) => {
                  return (
                    <View style={styles.option_container}>
                      <View
                        style={this.state.choosedWeek == index + 1 ? [styles.choosing_option_item, styles.center, styles.option_item] : [styles.option_item, styles.center]}
                        onClick={() => {
                          this.choosingWeek(index);
                        }}
                      >
                        <Text style={styles.option_text}>
                        第{this.WeekOptions[index]}周
                        </Text>
                        {/* rax 中无 display: none */}
                          {/* <Text style={this.state.currentWeek == index + 1 ? styles.current : styles.not_display}>当前</Text> */}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
              <View style={styles.center}>
                <Button onPress={() => this.hideWeekModal()} style={[styles.set_button, styles.center]}>
                  <Text style={[styles.button_text]}>设为当前周</Text>
                </Button>
              </View>
            </View>
            </Dropdown>
          </View>
        </View>
      </View>
    );
  }
}

var day = new Date().getDay() - 1; // 星期
var lessons = [
	[ 1, 2, 3, 4, 5, 6, 7],
  [ 1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5, 6, 7]
]
class Table extends Component {
  constructor(props) {
    super(props);
    this.weekData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    this.order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    this.weekDay = {
      "星期一": 0,
      "星期二": 1,
      "星期三": 2,
      "星期四": 3,
      "星期五": 4,
      "星期六": 5,
      "星期日": 6
    }
    this.state = {
      left: 100,
      top: 170,
      lessons: []
    }
  }
  
  componentWillMount () {
    let arr = new Array(7);
    for (let i = 0; i < 7; i++) {
      arr[i] = new Array(7);
    }
    
    TableService.getTableList().then(respond => {
      respond.map(lesson => {
        let day = lesson.day;
        let index = (parseInt(lesson.start) - 1 ) / 2;
        arr[index][this.weekDay.day].push(lesson)
      })
      this.setState({
        lessons: arr
      })
    })
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 100;
    this._previousTop = 170;
    this._tableStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop
      }
    };
  }

  componentDidMount () {
    this._updateLeft();
    this._updateTop();
  };
  
  _updateLeft() {
    let LeftTemp = this._tableStyles.style.left;
    if (LeftTemp > 100) {LeftTemp = 100;} 
    if (LeftTemp < -50) {LeftTemp = -50;}
    
    this.setState({
      left: LeftTemp
    });
    this.scrollView.scrollTo({x: 100 - LeftTemp})
  };
  
  _updateTop() {
    let TopTemp = this._tableStyles.style.top;
    if (TopTemp > 170) { TopTemp = 170; }
    if (TopTemp < -200) { TopTemp = -200; }
    this.setState({
      top: TopTemp
    });
  };

  _handleStartShouldSetPanResponder (e, gestureState) {
    return true;
  }

  _handleMoveShouldSetPanResponder (e, gestureState) {
    return true;
  }

  _handlePanResponderMove = (e, gestureState) => {
    if (Math.abs(gestureState.dy) >= Math.abs(gestureState.dx)) {
      this._tableStyles.style.top = this._previousTop + gestureState.dy;
      this._updateTop();
    } else {
      this._tableStyles.style.left = this._previousLeft + gestureState.dx;
      this._updateLeft();
    }
  };

  _handlePanResponderEnd = (e, gestureState) => {
    if (Math.abs(gestureState.dy) >= Math.abs(gestureState.dx)) {
       this._previousTop += gestureState.dy;
    } else {
      this._previousLeft += gestureState.dx;
    }
  };

  weekList = (item, index) => {
    return (
      <View style={day != index ? [styles.grid_width, styles.first_row, styles.center]:[styles.grid_today, styles.first_row, styles.center]}>
        <Text style={[styles.week_text]}>{item}</Text>
      </View>
    )
  };
  orderList = (item) => {
    return(
      <View style={[styles.order_grid,styles.grid_width,styles.grid_height, styles.center]}>
        <Text>{item}</Text>
      </View>
      )
  };
  
  render() {
    return (
      <View>
         <View><Text>{this.state.lessons}</Text></View>
        <View style={[styles.lesson_table, {
            top: this.state.top,
            left: this.state.left
          }]}
          ref={(table) => {
            this.table = table;
          }} 
          {...this._panResponder.panHandlers}
        >
          {lessons.map(column => {
            return (
              <View style={[styles.lesson_grid, styles.grid_width]}>
                {column.map((item, index) => {
                  if (item !== null || item !== undefined) {
                    return(
                      <View style={index == day ? [styles.daily_lesson, styles.grid_today] : [styles.daily_lesson, styles.grid_width]}>
                        <Text>{item}</Text>
                      </View>
                    )
                  } else {
                    return (
                      <View style={index == day ? [styles.daily_lesson, styles.grid_today] : [styles.daily_lesson, styles.grid_width]}>
                        
                      </View>
                    )
                  }
                  
                })}
              </View>
            )
          })}
          </View>
        <View style={[styles.column, styles.grid_width,{
                top: this.state.top
              }] }>
          {this.order.map(i => {
            return (
              <View style={[styles.order_grid,styles.grid_width,styles.grid_height, styles.center]}>
              	<Text>{i}</Text>
              </View>
            )})}
        </View>
        <View style={[styles.week_row, styles.first_row]}>
          <View style={[styles.grid_width, styles.first_row]}></View>
          	<ScrollView
          		ref={(scrollView) => {
            		this.scrollView = scrollView;
          		}}
          		style={[styles.week_data]}
          		horizontal={true}
          		showsHorizontalScrollIndicator={false}
        		>
          		{this.weekData.map(this.weekList)}
        	</ScrollView>
        </View>
      </View>
    )
  }
}

class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <Table></Table>
        <Header></Header>
      </View>
    );
  }
}

export default App;

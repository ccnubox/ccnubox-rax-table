import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import ListView from "rax-listview";
import Animated from "rax-animated";
import Button from "rax-button";
import Image from "rax-image";
import ScrollView from "rax-scrollview";
import PanResponder from 'universal-panresponder';
import TableService from './services/table';
import Modal from 'rax-modal';
import Link from 'rax-link';

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

 var initWeek = 1;

class Header extends Component {
  constructor(props) {
    super(props);
    this.WeekOptions =  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九","二十"];
    this.state = {
      currentWeek: initWeek, // 当前周
      choosedWeek: initWeek, // 设为当前周
      showsVerticalScrollIndicator: false,
      isShow: false,
      confirm: false
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
    this.refs.weekModal.hide();
  };

  confirmChange = () => {
    this.setState({
      currentWeek: this.state.choosedWeek,
      confirm: true
    });
    this.props.changeWeek(this.state.currentWeek);
    this.refs.weekModal.hide();
  };
  
  choosingWeek = (index) => {
    this.setState({
      choosedWeek: index + 1,
      confirm: false
    });
    this.props.changeWeek(this.state.choosedWeek);
  };

  render() {
    return (
      <View>
        <View style={[styles.header, styles.center]}>
        <Touchable onPress={this.refresh}  style={styles.header_refresh}>
          <Text style={[styles.fresh_text]}>刷新课表</Text>
        </Touchable>
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
                          {this.state.currentWeek == index + 1 &&  <Text style={[styles.font, styles.current]}>当前</Text>}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
              <View style={styles.center}>
                <Button onPress={() => this.confirmChange()} style={[styles.set_button, styles.center]}>
                  <Text style={[styles.button_text]}>设为当前周</Text>
                </Button>
              </View>
            </View>
            </Dropdown>
          </View>
          <View style={styles.add}>
            <Link
              href="http://192.168.1.16:9999/js/second.bundle.js?_wx_tpl=http://192.168.1.16:9999/js/index.second.js"
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

var day = new Date().getDay() - 1; // 本周的第几天
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
  weekDate[i] = (temp.getMonth() + 1) + "-" + temp.getDate();
}



let res = [
  {
      "course": "编译原理（单周）",
      "teacher": "杨青",
      "weeks": "3,5,7,9,11,13,15,17,19",
      "day": "星期一",
      "start": 3,
      "during": 2,
      "place": "本校9501",
      "remind": false,
      "id": "1",
      "color": 0
  },
  {
    "course": "编译原理（双周）",
    "teacher": "杨青",
    "weeks": "2,4,6,8,10,12,14,16,18",
    "day": "星期一",
    "start": 3,
    "during": 2,
    "place": "本校9501",
    "remind": false,
    "id": "11",
    "color": 1
},
  {
      "course": "专业英语",
      "teacher": "朱瑄",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期二",
      "start": 3,
      "during": 2,
      "place": "本校9501",
      "remind": false,
      "id": "2",
      "color": 1
  },
  {
      "course": "操作系统原理",
      "teacher": "朱瑄",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期二",
      "start": 7,
      "during": 2,
      "place": "本校6205",
      "remind": false,
      "id": "3",
      "color": 2
  },
  {
      "course": "人工智能",
      "teacher": "郭京蕾",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期二",
      "start": 9,
      "during": 2,
      "place": "本校9-12",
      "remind": false,
      "id": "4",
      "color": 3
  },
  {
      "course": "设计模式",
      "teacher": "外聘1",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期三",
      "start": 7,
      "during": 2,
      "place": "本校JKSYS2",
      "remind": false,
      "id": "5",
      "color": 0
  },
  {
      "course": "软件工程导论",
      "teacher": "外聘1",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期四",
      "start": 1,
      "during": 2,
      "place": "本校6205",
      "remind": false,
      "id": "6",
      "color": 1
  },
  {
      "course": "操作系统原理",
      "teacher": "朱瑄",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期四",
      "start": 3,
      "during": 2,
      "place": "本校6205",
      "remind": false,
      "id": "7",
      "color": 2
  },
  {
      "course": "数据库课程设计",
      "teacher": "罗昌银",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期四",
      "start": 7,
      "during": 2,
      "place": "本校JKSYS2",
      "remind": false,
      "id": "8",
      "color": 3
  },
  {
      "course": "软件项目管理",
      "teacher": "李蓉",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期四",
      "start": 9,
      "during": 2,
      "place": "本校9-12",
      "remind": false,
      "id": "9",
      "color": 0
  },
  {
      "course": "编译原理",
      "teacher": "杨青",
      "weeks": "2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
      "day": "星期五",
      "start": 1,
      "during": 2,
      "place": "本校9501",
      "remind": false,
      "id": "10",
      "color": 1
  }
]

var CourseArray = new Array(7);
for (let i = 0; i < 14; i++) {
  CourseArray[i] = new Array(14);
}
for (let i = 9; i < 7; i++) {
  for (let j = 0; j < 14; i++) {
    CourseArray[i][j] = [];
  }
}

var weekDay = {
  "星期一": 0,
  "星期二": 1,
  "星期三": 2,
  "星期四": 3,
  "星期五": 4,
  "星期六": 5,
  "星期日": 6
}
res.map(lesson => {
  let i = weekDay[lesson.day];
  let j = parseInt(weekDay.start);
  CourseArray[i - 1][j - 1].push(lesson);
})

var emptyGrids = [];
for (let i = 0; i < 7; i++) {
  emptyGrids[i] = new Array(14)
}
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 14; j++) {
    emptyGrids[i][j] = j;
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.weekData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    this.order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    this.colors = ['#f6b37f', '#f29c9f', '#13b5b1', '#8372D3'],
    this.grey = '#8E8E93',
    this.weekDay = {
      "星期一": 0,
      "星期二": 1,
      "星期三": 2,
      "星期四": 3,
      "星期五": 4,
      "星期六": 5,
      "星期日": 6
    },
    this.lesson = new Map(),
    this.state = {
      left: 100,
      top: 170,
      courseList: []
    }
  }
  
  componentWillMount () {
    // TableService.getTableList().then((res) => {
    //   res.map(lesson => {
    //    
    //   })
    // })

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._previousLeft = 80;
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
    if (LeftTemp > 80) {LeftTemp = 80;} 
    if (LeftTemp < -50) {LeftTemp = -50;}
    
    this.setState({
      left: LeftTemp
    });
    this.scrollView.scrollTo({x: 80 - LeftTemp})
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
      <View style={day != index ? [styles.grid_width, styles.first_row, styles.item_center]:[styles.grid_today, styles.first_row, styles.item_center]}>
        <Text style={[styles.week_text]}>{item}</Text>
        <Text style={[styles.font, {color: this.colors[0]}]}>{weekDate[index]}</Text>
      </View>
    )
  };
  orderList = (item) => {
    return(
      <View style={[styles.order_grid, styles.order_width, styles.grid_height, styles.center]}>
        <Text>{item}</Text>
      </View>
      )
  };
  showLesson = (list) => {
    this.setState({
      courseList: list
    })
    this.refs.lesson.show();
  };

  hideLesson = () => {
    this.refs.lesson.hide();
  };

  inArray = (s, week) => {
    let arr = [];
    arr = s.split(',');
    if (arr.indexOf(week.toString()) != -1) {
      return true
    }
    return false;
  };

  renderGrids = (column, index) => {
      return (
        <View style={day == index ?  [styles.lesson_column, styles.grid_today] : [styles.lesson_column, styles.grid_width]}>
          {
            column.map((item) => {
              return (
                <View style={index == day ? [styles.daily_lesson, styles.grid_today, styles.grid_height] : [styles.daily_lesson, styles.grid_width, styles.grid_height]}>
                </View>
              )
            })
          }
      </View>
      )
  };
  
  hasCourse = (arr, week) => { // 查看是否有重叠时间的课
    let result = {
      course: arr[0],
      flag: false
    }
    arr.map(item => {
      if (this.inArray(item.weeks, week)) {
        result.flag = true;
        result.course = item;
      } 
    })
    return result;
  }

  renderCourse = (item) => {
    let list = CourseMap.get(item.day + item.start);
    let flag = this.hasCourse(list, this.props.currentWeek).flag;
    let id = this.hasCourse(list, this.props.currentWeek).course.id;
      return  id == item.id && (
        <View style={ [styles.item_center, styles.daily_lesson, {
          width: parseInt(this.weekDay[item.day]) == day ? 200 : 100,
          position: 'absolute',
          top: (parseInt(item.start) - 1) * 100,
          left: parseInt(this.weekDay[item.day]) <= day ?  parseInt(this.weekDay[item.day]) * 100 : parseInt(this.weekDay[item.day]) * 100 + 100,
          height: parseInt(item.during) * 100
        }]}>
          <View onClick = {() => {this.showLesson(list)}} style={styles.item_center}>
              <View style={[styles.item_center, styles.lesson_item, {
                  backgroundColor:  flag ? this.colors[parseInt(item.color)] : this.grey,
                  width: parseInt(this.weekDay[item.day]) == day ? 188 : 88
                }]}>
                {flag ? 
                  <Text style={[styles.course_text, styles.font]}>{item.course}</Text>  
                  :  <Text style={[styles.course_text, styles.font]}>{item.course}(非本周)</Text>}
              </View>
                <View style={[styles.item_center, styles.course_info]}>
                <Text style={[styles.font]}>{item.teacher}</Text>
                <Text style={[styles.font, styles.grey_font ]}>@{item.place}</Text>
                </View>
          </View>
          <Modal ref="lesson" contentStyle={[styles.lesson_modal, {
            height: 200 * this.state.courseList.length - 50
          }]}>
            {this.state.courseList.map(course => {
              return (
                <Touchable onPress={this.hideLesson}>
              <View style={[styles.item_center, styles.modal_cards]}>
                <Text style={[styles.modal_font, styles.modal_course, {
                  color: this.colors[course.color]
                }]}>{course.course}</Text>
                <Text style={[styles.modal_font]}>{course.teacher}</Text>
                <Text style={[styles.modal_font]}>@{course.place}</Text>
              </View>
            </Touchable>
              )
            })}
          </Modal>
        </View>
      )
  }

  render() {
    return (
      <View>
        <View style={[styles.lesson_table, {
            top: this.state.top,
            left: this.state.left
          }]}
          ref={(table) => {
            this.table = table;
          }} 
          {...this._panResponder.panHandlers}
        >
          {emptyGrids.map(this.renderGrids)}
          {/* {res.map(this.renderCourse)} */}
          {CourseArray.map((column, index) => {
            return (
              <View style={day == index ?  [styles.lesson_column, styles.grid_today] : [styles.lesson_column, styles.grid_width]}>
                {column.map((list, index) => {
                  if(list.length > 0) {
                    let flag = this.hasCourse(list, this.props.currentWeek).flag;
                    let item = this.hasCourse(list, this.props.currentWeek).course.course;
                    return (
                      <View style={ [styles.item_center, styles.daily_lesson, {
                        width: parseInt(this.weekDay[item.day]) == day ? 200 : 100,
                        height: parseInt(item.during) * 100
                      }]}>
                        <View onClick = {() => {this.showLesson(list)}} style={styles.item_center}>
                            <View style={[styles.item_center, styles.lesson_item, {
                                  backgroundColor:  flag ? this.colors[parseInt(item.color)] : this.grey,
                                  width: index == day ? 188 : 88
                              }]}>
                              {flag ? 
                                <Text style={[styles.course_text, styles.font]}>{item.course}</Text>  
                                :  <Text style={[styles.course_text, styles.font]}>{item.course}(非本周)</Text>}                            </View>
                              <Text style={[styles.font]}>{item.teacher}</Text>
                              <Text style={[styles.font]}>@{item.place}</Text>
                        </View>
                        <Modal ref="lesson" contentStyle={[styles.lesson_modal, {
                            height: 200 * this.state.courseList.length - 50
                          }]}>
                        {this.state.courseList.map(course => {
                          return (
                            <Touchable onPress={this.hideLesson}>
                            <View style={[styles.item_center, styles.modal_cards]}>
                              <Text style={[styles.modal_font, styles.modal_course, {
                                color: this.colors[course.color]
                              }]}>{course.course}</Text>
                              <Text style={[styles.modal_font]}>{course.teacher}</Text>
                              <Text style={[styles.modal_font]}>@{course.place}</Text>
                            </View>
                          </Touchable>
                        )
                        })}
                        </Modal>
                      </View>
                    )
                  }
                }
                )
            }
            </View>
          )})}
        </View>
        <View style={[styles.column, styles.grid_width,{
                top: this.state.top
              }] }>
          {this.order.map(i => {
            return (
              <View style={[styles.order_grid,styles.order_width,styles.grid_height, styles.center]}>
              	<Text>{i}</Text>
              </View>
            )})}
        </View>
        <View style={[styles.week_row, styles.first_row]}>
          <View style={[styles.order_width, styles.first_row]}></View>
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
  constructor(props) {
    super(props);
    this.state = {
      currentWeek: 1
    }
  }
  changeWeektoTable = (week) => {
    this.setState({
      currentWeek: week
    })
  };
  
  render() {
    return (
      <View style={styles.app}>
        <Table currentWeek = {this.state.currentWeek}></Table>
        <Header changeWeek = {(week) => this.changeWeektoTable(week)}></Header>
      </View>
    );
  }
}

export default App;

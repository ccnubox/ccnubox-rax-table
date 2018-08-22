import { createElement, Component, PropTypes, setNativeProps } from "rax";
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
// const native = require("@weex-module/test");
import Dropdown from "../box-ui/common/dropdown-list/index";

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
      confirm: true,
      termBegin: true
    });
    this.props.changeWeek(this.state.currentWeek);
    this.refs.weekModal.hide();
  };
  
  choosingWeek = (index) => {
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
    })
  }

  render() {
    return (
      <View>
        <View style={[styles.header, styles.center]}>
          <Touchable
            onPress={this.showWeekModal}
            style={[styles.choose_label, styles.center]}
          >
            {startTerm > Date.now() && this.state.choosedWeek === 0 ? 
            <Text style={styles.choose_text}>未开学</Text> : <Text style={styles.choose_text}>第{this.state.choosedWeek}周</Text>}
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
              {startTerm > Date.now() && 
                <View style={styles.option_container}>
                  <Touchable onPress={() => {this.termBegan()}} 
                        style={ [styles.option_item, styles.center, {
                          backgroundColor: this.state.termBegin ?  '#ffffff' : '#D7D8D9'
                        }]}>
                    {this.state.currentWeek === 0 &&  <View style={[styles.equal_item]}></View>}
                    <Text style={styles.option_text}>未开学</Text>
                    {this.state.currentWeek === 0 &&  <Text style={[styles.equal_item, styles.font, styles.current]}>当前</Text>}
                  </Touchable>
                </View>}
                {this.WeekOptions.map((item, index) => {
                  return (
                    <View style={styles.option_container}>
                      <View
                        style={ [styles.center, styles.option_item, {
                          backgroundColor: this.state.choosedWeek == index + 1 ? '#D7D8D9' : '#ffffff'
                        }]}
                        onClick={() => {
                          this.choosingWeek(index);
                        }}
                      > 
                        {this.state.currentWeek == index + 1 &&  <View style={[styles.equal_item]}></View>}
                        <Text style={[styles.option_text, styles.option_size]}>第{this.WeekOptions[index]}周</Text>
                          {this.state.currentWeek == index + 1 &&  <Text style={[styles.equal_item, styles.font, styles.current]}>当前</Text>}
                      </View>
                    </View>
                  )
                })}
              </ScrollView>
              <View style={[styles.center]}>
                <Button onPress={() => this.confirmChange()} style={[styles.set_button, styles.center]}>
                  <Text style={[styles.button_text, styles.option_size]}>设为当前周</Text>
                </Button>
              </View>
            </View>
            </Dropdown>
          </View>
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
  weekDate[i] = (temp.getMonth() + 1) + "-" + temp.getDate();
}

var emptyGrids = [];
for (let i = 0; i < 7; i++) {
  emptyGrids[i] = new Array(14)
}
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 14; j++) {
    emptyGrids[i][j] = j;
  }
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
return emptyCourseArray
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
      courseList: [],
      courseArray: getEmptyCourseArray()
    }
    this._tableStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop
      }
    };
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
    this._orderStyles = {
      style: {
        top: this._previousTop
      }
    }
  }

  reset = () => {
    this.setState({
      courseList: [],
      courseArray: getEmptyCourseArray()
    })
  }
  
  componentWillMount () {
    this.getCourse();
  }

  componentDidMount () {
    this._updateLeft();
    this._updateTop();
  };

  setCourseArray = (res, _CourseArray) => {
    res.map((lesson) => {
      let i = this.weekDay[lesson.day];
      let start = parseInt(lesson.start);
      let during = parseInt(lesson.during);
      
      for (let j = start; j < during + start; j++) {
        if(_CourseArray[i][j - 1] == undefined){
        _CourseArray[i][j - 1] = []
      }
        _CourseArray[i][j - 1].push(lesson)
      }
    })
    return _CourseArray;
  }

  getCourseFromServer = () => {
    let _CourseArray = this.state.courseArray;
    TableService.getTableList().then((res) => {
      // native.saveCachedTable(JSON.stringify(res))
      this.setState({
        courseArray: this.setCourseArray(res, _CourseArray)
      })
    })
  }
  
  getCourse = () => {
    // native.getCachedTable((res) => {
    //   if (res.code === "404") {
    //     this.getCourseFromServer();
    //   } else {
    //     let _CourseArray = this.state.courseArray;
    //     this.setState({
    //       courseArray: this.setCourseArray(JSON.parse(res.result), _CourseArray)
    //     })
    //   }
    // })

    this.getCourseFromServer();
  }
  _updateLeft() {
    let LeftTemp = this._tableStyles.style.left;
    if (LeftTemp > 80) {LeftTemp = 80} 
    if (LeftTemp < -50) {LeftTemp = -50}
    
    // this.setState({
    //   left: LeftTemp
    // });
    this._tableStyles.style.left = LeftTemp;
    setNativeProps(this.table, {
      style: {
        left: LeftTemp,
        top: this._tableStyles.style.top,
      }
    })
    this.scrollView.scrollTo({x: 80 - LeftTemp})
  };
  
  _updateTop() {
    let TopTemp = this._tableStyles.style.top;
    if (TopTemp > 170) { TopTemp = 170; }
    if (TopTemp < -200) { TopTemp = -200; }
    this._tableStyles.style.top = TopTemp
    this._orderStyles.style.top = TopTemp
    setNativeProps(this.table, {
      style: {
        left: this._tableStyles.style.left,
        top: this._tableStyles.style.top,
      }
    })
    setNativeProps(this.orderList, {
      style: {
        top: this._tableStyles.style.top,
      }
    })
  };

  _handleStartShouldSetPanResponder (e, gestureState) {
    return true;
  }

  _handleMoveShouldSetPanResponder (e, gestureState) {
    return true;
  }

  _handlePanResponderMove = (e, gestureState) => {
    if (Math.abs(gestureState.dy) >= Math.abs(gestureState.dx)) {
      if (!(this._tableStyles.style.top == -200 && gestureState.dy < 0) && !(this._tableStyles.style.top == 170 && gestureState.dy > 0)) {
        this._tableStyles.style.top = this._previousTop + gestureState.dy;
        this._updateTop();
      }
    } else {
      if (!(this._tableStyles.style.left == -50 && gestureState.dx < 0) && !(this._tableStyles.style.left == 80 && gestureState.dx > 0)) {
        this._tableStyles.style.left = this._previousLeft + gestureState.dx;
        this._updateLeft();
      }
    }
  };

  _handlePanResponderEnd = (e, gestureState) => {
    if (Math.abs(gestureState.dy) >= Math.abs(gestureState.dx)) {
      if (!(this._tableStyles.style.top == -200 && gestureState.dy < 0) && !(this._tableStyles.style.top == 170 && gestureState.dy > 0)) {
        this._previousTop += gestureState.dy;
      }
    } else {
      if (!(this._tableStyles.style.left == -50 && gestureState.dx < 0) && !(this._tableStyles.style.left == 80 && gestureState.dx > 0)) {
        this._previousLeft += gestureState.dx;
      }
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
  };

  showDelete = () => {
    this.refs.deleteModal.show()
  }

  deleteCourse = (id) => {
    TableService.deleteLesson(id).then(res => {
      this.refs.deleteModal.hide()
      this.getCourse()
    })
  }

  render() {
    return (
      <View>
        <View style={[styles.lesson_table, this._tableStyles.style]}
          ref={(table) => {
            this.table = table;
          }} 
          {...this._panResponder.panHandlers}
        >		
          {this.state.courseArray.map((column, index) => {
            return (
              <View style={day == index ?  [styles.lesson_column, styles.grid_today] : [styles.lesson_column, styles.grid_width]}>
                {column.map((list, i) => {
                  if(list.length > 0) {
                    let flag = this.hasCourse(list, this.props.currentWeek).flag;
                    let item = this.hasCourse(list, this.props.currentWeek).course;
                    // if (i == parseInt(item.start)) {
                    return (
                      <View style={ [styles.item_center, styles.daily_lesson, {
                        width: this.weekDay[item.day] == day ? 200 : 100,
                        height: parseInt(item.during) * 100,
                        position: 'absolute',
                        top: (parseInt(item.start) - 1) * 100,
                      }]}>
                        <Touchable
                          onPress = {() => {this.showLesson(list)}}
                          delayPressIn={400}
                          delayPressOut={1000}
                          delayLongPress={800}
                          onLongPress = {() => this.showDelete(item.id)}
                          style={[styles.lesson_grid_center, {
                            justifyContent: list.length > 1 ? 'space-between' : 'center',
                            height: parseInt(item.during) * 100
                          }]}>
                          { list.length > 1 && <View></View>}
                          <View>
                            <View style={[styles.item_center, styles.lesson_item, {
                                  backgroundColor: flag ? this.colors[parseInt(item.color)] : this.grey,
                                  width: index == day ? 188 : 88
                              }]}>
                              {flag ? 
                                <Text style={[styles.course_text, styles.font]}>{item.course}</Text>  
                                :  <Text style={[styles.course_text, styles.font]}>{item.course}(非本周)</Text>}                            
                            </View>
                            <View style={[styles.item_center, styles.course_info]}>
                              <Text style={[styles.font]}>{item.teacher}</Text>
                              <Text style={[styles.font, styles.grey_font]}>@{item.place}</Text>
                            </View>
                          </View>
                          { list.length > 1 && <View style={[styles.more]}></View>}
                        </Touchable>
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
                        <Modal ref="deleteModal" contentStyle={[styles.delete_modal, styles.item_center]}>
                          <Touchable onPress={() => this.deleteCourse(item.id)} style={[styles.delete_course, styles.delete_button, styles.center]}>
                            <Text style={[styles.delete_text, styles.confirm_delete]}>删除课程</Text>
                          </Touchable>
                          <Touchable onPress={() => this.refs.deleteModal.hide()} style={[styles.cancel_delete, styles.delete_button, styles.center]}>
                            <Text style={[styles.delete_text, styles.cancel_text]}>取消</Text>
                          </Touchable>
                        </Modal>
                      </View>
                    )
                  // }
                  } else {
                    return (
                      <View style={[{ width: index == day ? 200 : 100,
                              position: 'absolute',
              				        top:  i * 100,
                            }, styles.daily_lesson, styles.grid_height]}> 
                      </View>)}
                  }
                )
            }
          </View>
        )})}
        </View>
        <View ref={(orderList) => {this.orderList = orderList}}
          style={[styles.column, styles.grid_width, this._orderStyles.style] }>
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
        <Table ref="table" currentWeek = {this.state.currentWeek}></Table>
        <Header changeWeek = {(week) => this.changeWeektoTable(week)}></Header>
        <Touchable onPress={() => { this.refs.table.reset(); this.refs.table.getCourseFromServer()}}  style={styles.header_refresh}>
          <Text style={[styles.fresh_text]}>刷新课表</Text>
        </Touchable>
      </View>
    );
  }
}

export default App;

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
import Dropdown from "../box-ui/common/dropdown-list/index";

var initWeek = 0;
var startTerm = new Date(2018, 8, 1);

class Header extends Component {
  constructor(props) {
    super(props);
    this.WeekOptions =  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九","二十", "二十一", "二十二", "二十三", "二十四"];
    this.state = {
      currentWeek: initWeek, // 当前周
      choosedWeek: initWeek, // 设为当前周
      showsVerticalScrollIndicator: false,
      isShow: false,
      confirm: false,
      termBegin: false
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
                  <View onClick={() => {this.termBegan()}} 
                        style={this.state.termBegin ? [styles.option_item, styles.center] : [styles.choosing_option_item, styles.center, styles.option_item]}>
                    <Text style={styles.option_text}>未开学</Text>
                  </View>
                </View>}
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
      courseArray: []
    }
  }
  
  componentWillMount () {
    this.getCourse();
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
    this._orderStyles = {
      style: {
        top: this._previousTop
      }
    }
  }

  componentDidMount () {
    this._updateLeft();
    this._updateTop();
  };
  
  getCourse = () => {
    var _CourseArray = new Array(7);
    for (let i = 0; i < 7; i++) {
      _CourseArray[i] = new Array(14);
    }
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 14; j++) {
        _CourseArray[i][j] = new Array();
      }
    }
    TableService.getTableList().then((res) => {
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
    })
    this.setState({
      CourseArray: _CourseArray
    })
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
    TableService.deleteCourse(id).then(res => {
      this.refs.deleteModal.hide()
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
          {this.state.CourseArray.map((column, index) => {
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
                          style={styles.item_center}>
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
        <Touchable onPress={() => {this.refs.table.getCourse()}}  style={styles.header_refresh}>
          <Text style={[styles.fresh_text]}>刷新课表</Text>
        </Touchable>
      </View>
    );
  }
}

export default App;

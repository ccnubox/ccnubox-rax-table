import {createElement, Component} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import styles from "./add.css";
import TableService from "./services/table";
import Touchable from "rax-touchable";
import Animated from "rax-animated";
import Button from "rax-button";
import Image from "rax-image";
import ScrollView from "rax-scrollview";
import TextInput from 'rax-textinput';
import Modal from 'rax-modal';

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacher: "",
      course: "",
      weeks: "",
      day: "",
      during: 2, 
      place: "", 
      day: "星期三",
      startTime: 3,
      endTime: 3,
      weeksArray: [],
      weekMap: [],
      weekVisible: false,
      timeVisible: false,
      choosingOdd: false,
      choosingEven: false,
      choosingAll: false
    }
    this.weeks = [],
    this.weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    this.timeArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  }
  componentWillMount() {
    let tempArr = new Array(24);
    for(let i = 0; i < 24; i++) {
      tempArr[i] = false;
    }
    this.setState({
      weekMap: tempArr
    });
    for (let i = 0; i < 4; i++) {
        this.weeks[i] = []
    }
    for (let i = 0; i <= 3; i++) {
      for (let j = 1; j <= 6; j++) {
        this.weeks[i].push(i * 6 + j)
      }
   }
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
        tempArr.push(i + 1)
      }
    }
    this.setState({
      weeksArray: tempArr
    })
   };
  chooseOddWeeks = () => {
    let tempMap = [];
    for(let i = 0; i < 24; i++) {
      i % 2 ? tempMap[i] = false : tempMap[i] = true;
    }
    this.setState({
      weekMap: tempMap,
      choosingOdd: true,
      choosingEven: false,
      choosingAll: false
    })
  };
  chooseEvenWeeks = () => {
    let tempMap = [];
    for(let i = 0; i < 24; i++) {
      i % 2 ? tempMap[i] = true : tempMap[i] = false;
    }
    this.setState({
      weekMap: tempMap,
      choosingEven: true,
      choosingOdd: false,
      choosingAll: false
    })
  };
  chooseAllWeeks = () => {
    let tempMap = [];
    for(let i = 0; i <= 23; i++) {
      tempMap[i] = true;
    }
    this.setState({
      weekMap: tempMap,
      choosingAll: true,
      choosingOdd: false,
      choosingEven: false
    })
  };
  chooseOneWeek = (i) => {
    let tempMap = this.state.weekMap;
    tempMap[i] = !tempMap[i]
    this.setState({
      weekMap: tempMap
    })
  };

  chooseDay = (day, index) => {
    this.setState({
      day: day
    })
    this.WeekScrollView.scrollTo({y: (index - 2) * 80})
  };

  chooseStart = (item, index) => {
    this.setState({
      startTime: item
    })
    this.StartScrollView.scrollTo({y: (index - 2) * 80})
  };

  chooseEnd = (item, index) => {
    this.setState({
      endTime: item
    })
    this.EndScrollView.scrollTo({y: (index - 2) * 80})
  };
  confirmTime = () => {
    if (this.state.startTime > this.state.endTime) {
      this.refs.tipModal.show();
    } else {
      this.refs.timeModal.hide();
    }
  }
  confirmAdd = () => {
    let course = {
      "course": this.state.course,
      "teacher": this.state.teacher,
      "weeks": this.state.weeksArray.toString(),
      "day": this.state.day,
      "start": this.state.startTime,
      "during": this.state.endTime - this.state.startTime + 1,
      "place": this.state.place,
      "remind": false
    }
    TableService.addLesson(big, sid, jid, password, course).then(res => {
      // 跳转到 index
    })
  };
  render() {
    return (
      <View style={styles.app}>
        <View style={[styles.header, styles.flex_row ]}>
          <Text style={[styles.header_text, styles.table]}>课程表</Text>
          <Touchable onPress={() => {this.confirmAdd}}>
            <Text style={[styles.header_text, styles.header_finsh]}>完成</Text>
          </Touchable>
        </View>
        <View style={[styles.box, styles.info_box]}>
          <TextInput
            placeholder="请输入课程名称"
            value={this.state.course}
            style={[styles.input_box]}
            />
          <TextInput
            placeholder="请输入任教教师"
            value={this.state.teacher}
            style={[styles.input_box]}
            />
        </View>
        <Text style={[styles.time]}>上课时间</Text>
        <View style={[styles.box, styles.time_box]}>
          <Touchable  onPress={this.showWeek} style={[styles.input_box, styles.time_choose]}>
            <Text style={[styles.input_word, styles.center, styles.time_word]}>选择上课周次</Text>
        	</Touchable>
          <Touchable  onPress={this.showTime} style={[styles.input_box, styles.time_choose]}>
            <Text style={[styles.input_word, styles.center, styles.time_word]}>选择上课时间</Text>
        	</Touchable>
           <TextInput
            placeholder="请输入上课地点"
            value={this.state.place}
            style={[styles.input_box]}
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
             	<View style={[styles.border_bottom, styles.table_header, styles.table_row, styles.row_height, styles.center, {
                       backgroundColor: this.state.choosingOdd ? '#6767fa' : '#ffffff'
                     }]}>
                 <Touchable onPress={this.chooseOddWeeks} style={[styles.equal_div, styles.center, styles.border_right]}>
                   <View style={[styles.table_row, styles.center]}>
            		<Text style={[{color: this.state.choosingOdd ? '#ffffff' : '#6767fa'}]}>单周</Text>
                     </View>
                 </Touchable>
               <Touchable onPress={this.chooseEvenWeeks} style={[styles.equal_div, styles.center, styles.border_right, {
                       backgroundColor: this.state.choosingEven ? '#6767fa' : '#ffffff'
                     }]}>
                 <View style={[styles.table_row, styles.center]}>
              <Text style={[{color: this.state.choosingEven ? '#ffffff' : '#6767fa'}]}>双周</Text>
                    </View>
               </Touchable>
               <Touchable onPress={this.chooseAllWeeks} style={[styles.equal_div, styles.center, styles.row_height, {
                       backgroundColor: this.state.choosingAll ? '#6767fa' : '#ffffff'
                     }]}>
                <View style={[styles.table_row, styles.center]}>
                 <Text style={[{color: this.state.choosingAll ? '#ffffff' : '#6767fa'}]}>全选</Text>
                  </View>
               </Touchable>
               </View>
               <View>
                 {this.weeks.map((row, rowIndex) => {
                   return (
                     <View style={rowIndex != 3 ? [styles.table_row, styles.border_bottom, styles.center] : [styles.table_row, styles.center]}>
                       { row.map((item, itemIndex) => {
                       return (
                         <Touchable onPress={() => {this.chooseOneWeek(item - 1)}} style={itemIndex != 5 ? 
                             [styles.border_right, styles.equal_div, styles.center, {
                       			backgroundColor: this.state.weekMap[item - 1] ? '#feb75a' : '#ffffff'
                     		  }] : [styles.equal_div, styles.center, {
                       				backgroundColor: this.state.weekMap[item - 1] ? '#feb75a' : '#ffffff'
                     				}]}>
                       	 	<View style={[styles.table_row, styles.center]}>
                           <Text>{item}</Text>   
                        	</View>
                        </Touchable>    
                       )
                     }
                   )}
                    </View>
                  )
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
                ref={(scrollView) => {
                  this.WeekScrollView = scrollView;
                }}
                style={[styles.time_scroll, styles.equal_div]}
                showsVerticalScrollIndicator={false}
              >
                {this.weekdays.map((day, index) => {
                return(
                  <Touchable onPress={() => {this.chooseDay(day, index)}} 
                    style={[styles.time_item, styles.center]}>
                  	<Text style={{
                          fontSize: this.state.day === day ? 35 : 30,
                          color: this.state.day === day ? '#6767fa' : '#000000'
                          }}>
                      {day}
                    </Text>
                  </Touchable>
                  )
                })}
              </ScrollView>
              <ScrollView
                ref={(scrollView) => {
                  this.StartScrollView = scrollView;
                }}
                style={[styles.time_scroll, styles.equal_div]}
                showsVerticalScrollIndicator={false}
              >
                {this.timeArr.map((item, index) => {
                  return(
                    <Touchable onPress={() => {this.chooseStart(item, index)}} 
                    style={[styles.time_item, styles.center]}>
                  	<Text style={{
                          fontSize: this.state.startTime === item ? 35 : 30,
                          color: this.state.startTime === item ? '#6767fa' : '#000000'
                          }}>{item}</Text>
                    </Touchable>
                    )
                })}
              </ScrollView>
              <ScrollView
                ref={(scrollView) => {
                  this.EndScrollView = scrollView;
                }}
                style={[styles.time_scroll, styles.equal_div]}
                showsVerticalScrollIndicator={false}
              >
                {this.timeArr.map((item, index) => {
                  return(
                    <Touchable onPress={() => {this.chooseEnd(item, index)}} 
                    style={[styles.time_item, styles.center]}>
                  	<Text style={{
                          fontSize: this.state.endTime === item ? 35 : 30,
                          color: this.state.endTime === item ? '#6767fa' : '#000000'
                          }}>到 {item}</Text>
                    </Touchable>
                    )
                })}
              </ScrollView>
          </View>
        </Modal>
        <Modal ref="tipModal" contentStyle={[styles.tip_modal, styles.column_center]}>
          <View style={[styles.column_center, styles.modal_title]}>
            <Text style={styles.bold_text}>提示</Text>
            <Text style={styles.tip_content}>请输入正确的课程时间</Text>
          </View>
          <Touchable onPress={() => {this.refs.tipModal.hide()}} style={[styles.column_center, styles.confirm]}>
            <Text style={styles.blue_text}>确定</Text>
          </Touchable>
        </Modal>
      </View>
    )
  }
}

export default Add;

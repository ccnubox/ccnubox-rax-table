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
      course: {
        teacher: "",
      	course: "",
      	weeks: "",
      	day: "",
        start: 1,
        during: 2, 
        place: "", 
        remind: false
      },
      weeksArray: [],
      weekMap: [],
      weekVisible: false,
      timeVisible: false,
      choosingOdd: false,
      choosingEven: false,
      choosingAll: false
    }
    this.weeks = [],
    this.weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
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
  }
  
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
  }
  render() {
    return (
      <View style={styles.app}>
        <View style={[styles.header, styles.flex_row ]}>
          <Text style={[styles.header_text, styles.table]}>课程表</Text>
          <Text style={[styles.header_text, styles.header_finsh]}>完成</Text>
        </View>
        <View style={[styles.box, styles.info_box]}>
          <TextInput
            placeholder="请输入课程名称"
            value={this.state.course.course}
            style={[styles.input_box]}
            />
          <TextInput
            placeholder="请输入任教教师"
            value={this.state.course.teacher}
            style={[styles.input_box]}
            />
        </View>
        <Text style={[styles.time]}>上课时间</Text>
        <View style={[styles.box, styles.time_box]}>
          <Touchable  onPress={this.showWeek} style={[styles.input_box]} OnClick = {() => {this.showWeek}}>
            <Text style={[styles.input_word, styles.center]}>选择上课周次</Text>
        	</Touchable>
          <Touchable  onPress={this.showTime} style={[styles.input_box]} OnClick = {() => {this.showTime}}>
            <Text style={[styles.input_word, styles.center]}>选择上课时间</Text>
        	</Touchable>
           <TextInput
            placeholder="请输入上课地点"
            value={this.state.course.place}
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
        <Modal ref="timeModal">
          <View style={[styles.modal_header, styles.center]}>
              <Touchable onPress={this.hideWeek}>
            <Text style={[styles.purple_text]}>取消</Text>
             </Touchable>
            <Touchable onPress={this.confirmWeek}>
             <Text style={[styles.purple_text]}>确认</Text>
          	</Touchable>
          </View>
          <View>
              <View>
              <ScrollView
                ref={(scrollView) => {
                  this.WeekScrollView = scrollView;
                }}
                
              >
                {weekdays.map((day, index) => {

                })}
              </ScrollView>
              <ScrollView
                ref={(scrollView) => {
                  this.StartScrollView = scrollView;
                }}
              >
                {this.timeArr.map()}
              </ScrollView>
              <ScrollView
                ref={(scrollView) => {
                  this.EndScrollView = scrollView;
                }}
              >
                {this.timeArr.map()}
              </ScrollView>
              </View>
          </View>
        </Modal>
      </View>
    )
  }
}


export default Add;
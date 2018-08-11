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
      timeVisible: false
    }
    this.weeks = []
  }
  componentWillMount() {
    let tempArr = new Array(24);
    for(let i = 0; i < 24; i++) {
      tempArr[i] = false;
    }
    this.setState({
      weekMap: tempArr
    });
    for (let i = 1; i <= 24; i++) {
      this.weeks.push(i);
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
  };
  chooseOddWeeks = () => {
    let tempMap = [];
    for(let i = 1; i <= 24; i++) {
      i % 2? tempMap[i] = true : tempMap[i] = false;
    }
    this.setState({
      weekMap: tempMap
    })
  };
  chooseEvenWeeks = () => {
    let tempMap = [];
    for(let i = 1; i <= 24; i++) {
      i % 2? tempMap[i] = false : tempMap[i] = true;
    }
    this.setState({
      weekMap: tempMap
    })
  };
  chooseAllWeeks = () => {
    let tempMap = [];
    for(let i = 1; i <= 24; i++) {
      tempMap[i] = true;
    }
    this.setState({
      weekMap: tempMap
    })
  };
  chooseOneWeek = (i) => {
    let tempMap = this.state.weekMap;
    tempMap[i] = !tempMap[i]
    this.setState({
      weekMap: !tempMap
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
            <Text>取消</Text>
             </Touchable>
            <Touchable onPress={this.confirmWeek}>
             <Text>确认</Text>
          	</Touchable>
              </View>
           <View style={[styles.choose_cont, styles.center]}>
             <View style={[styles.choose_week]}>
             	<View style={[styles.table_header]}>
                 <Touchable onPress={this.chooseOddWeeks}>
            		<Text>单周</Text>
                 </Touchable>
               <Touchable onPress={this.chooseEvenWeeks}>
              <Text>双周</Text>
               </Touchable>
               <Touchable onPress={this.chooseAllWeeks}>
                <Text>全选</Text>
               </Touchable>
               </View>
               <View>
                 {this.weeks.map((i) => {
                   return (
                     <View>
                       <Text>{i}</Text>
                       </View>
                   )
                 })}
                 </View>
            </View>
            </View>
        </Modal>
        <Modal ref="timeModal">
          <View>
            <Touchable onPress={this.hideTime}>
            <Text>
              Close
            </Text>
          </Touchable>
            <Text>
              I am a time
            </Text>
          </View>
        </Modal>
      </View>
    )
  }
}

export default Add;
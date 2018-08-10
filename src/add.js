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
      weekVisible: false,
      timeVisible: false
    }
  }
  showWeek = () => {
    this.setState({
      weekVisible: !this.state.weekVisible
    })
  }
  showTime = () => {
    this.setState({
      timeVisible: !this.state.timeVisible
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
          <Touchable style={[styles.input_box]} OnClick = {() => {this.showWeek}}>
            <Text style={[styles.input_word, styles.center]}>选择上课周次</Text>
        	</Touchable>
          <Touchable style={[styles.input_box]} OnClick = {() => {this.showTime}}>
            <Text style={[styles.input_word, styles.center]}>选择上课时间</Text>
        	</Touchable>
           <TextInput
            placeholder="请输入上课地点"
            value={this.state.course.place}
            style={[styles.input_box]}
            />
        </View>
        {this.state.weekVisible && <View style={[styles.modal]}>
          </View>}
        {this.state.timeVisible &&  <View style={[styles.modal]}>
          </View>}
      </View>
    )
  }
}


export default Add;
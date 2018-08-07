import {createElement, Component, render} from 'rax';
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
        start: "",
        during: "", 
        place: "", 
        remind: false
      },
      weeks: [],
      startInt: 1,
      duringInt: 1
    }
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
          
        </View>
      </View>
    )
  }
}

export default Add;
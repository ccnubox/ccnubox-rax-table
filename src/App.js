import { createElement, Component, PropTypes } from "rax";
import View from "rax-view";
import Text from "rax-text";
import styles from "./App.css";
import Touchable from "rax-touchable";
import ListView from "rax-listview";
// import TableService from "./services/table";
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
          </Touchable>
        <View style={styles.dropdown_container}>
          <Dropdown ref="weekModal"> 
            <View style={styles.list_container}>
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
              <Button onPress={() => this.hideWeekModal()} style={[styles.set_button, styles.center]}>
                <Text style={[styles.button_text]}>设为当前周</Text>
              </Button>
            </View>
            </Dropdown>
          </View>
        </View>
      </View>
    );
  }
}

var day = new Date().getDay() - 1; // 星期

class Grid extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <View style={day == this.props.key ? [styles.gird_today, styles.grid_height, styles.grid] : [styles.gird_width, styles.grid_height, styles.grid]}>
        <Text>{this.props.data}哈哈</Text>
      </View>
    );
  }
}


var lessons = new Array(7);
for (let i = 0; i < 7; i++) {
  lessons[i] = new Array(14);
}

let createGrid = (value, index) => <Grid key={index} data={value}/>;


class Table extends Component {
  constructor(props) {
    super(props);
    this.weekData = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    this.order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    this.state = {
      scrollWeek: false
    }
  }
  weekList = (item, index) => {
    return (
      <View style={day != index ? [styles.grid_width, styles.first_column, styles.center, styles.column]:[styles.grid_today, styles.first_column, styles.center, styles.column]}>
        <Text style={[styles.week_text]}>{item}</Text>
      </View>
    )
  }
  orderList = (item) => {
    return(
      <View style={[styles.column, styles.order_grid,styles.grid_width,styles.grid_height, styles.center]}>
        <Text>{item}</Text>
      </View>
      )
  }
  
  render() {
    return (
      <View style={[styles.table]}>
        <View style={styles.week_row}>
          <View style={[styles.grid_width, styles.first_column, styles.grid_height]}></View>
          <ScrollView
          ref={(scrollView) => {
            this.horizontalScrollView = scrollView;
          }}
          styles={[styles.order_lesson]}
          horizontal={true}
            showsHorizontalScrollIndicator={false}
          onEndReached={() => this.setState({scrollWeek: true})}
        >
          {this.weekData.map(this.weekList)}
        </ScrollView>
        </View>
        <View>
          <ScrollView
           ref={(scrollView) => {
             this.horizontalScrollView = scrollView;
           }}
             styles={[styles.order_lesson]}
          horizontal={true}
            showsHorizontalScrollIndicator={false}
           //onEndReached={() => this.setState({scrollWeek: true})}
        >
            <View style={[styles.column] }>
				{/*{
              	<ListView style={[styles.column]}
                  renderRow={this.orderList}
        			dataSource={this.order}
                  /> */}
              
              {this.order.map(i => {
            return (
              <View style={[styles.column, styles.order_grid,styles.grid_width,styles.grid_height, styles.center]}>
              <Text>{i}</Text>
                </View>
            )})}
        	 </View>
            <View style={[styles.lesson_table]}>
          		{lessons.map(column => {
            		column.map(createGrid)
          		})}
             </View>
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

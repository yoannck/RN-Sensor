import React, { Component } from 'react';
import {
  SafeAreaView, StyleSheet, ScrollView, View,
  Text, StatusBar, Button, TextInput
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { accelerometer, gyroscope, setUpdateIntervalForType } from "react-native-sensors";
import { CheckBox } from 'react-native-elements';

let subscriptionAccelerometer = null;
let subscriptionGyroscope = null;

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      username: null,
      checkBoxes: [
        {id: 0, name: 'Balance', selected: false},
        {id: 1, name: 'Chair Rise', selected: false},
        {id: 2, name: 'Step up', selected: false},
        {id: 3, name: 'TUG', selected: false},
        {id: 4, name: '10 x 4m walk', selected: false}
      ],
      lock: true,
      resultsAccelerometer: [],
      resultsGyroscope: [],
      progress: false,
    };
  }

  start() {
    console.log('START');
    this.setState({progress: true, resultsAccelerometer: [], resultsGyroscope: []}, () => {
      setUpdateIntervalForType('accelerometer', 1000); //100hz - 10ms too fast
      setUpdateIntervalForType('gyroscope', 1000); //100hz - 10ms too fast
      subscriptionAccelerometer = accelerometer.subscribe(({ x, y, z, timestamp }) => {
        // let date = new Date(Number(timestamp));
        // datevalues = [
        //  date.getFullYear(),
        //  date.getMonth()+1,
        //  date.getDate(),
        //  date.getHours(),
        //  date.getMinutes(),
        //  date.getSeconds(),
        // ];
        // console.log('accelerometer', { x, y, z, datevalues });
        let { resultsAccelerometer } = this.state;
        resultsAccelerometer.unshift({x, y, z});
        this.setState({resultsAccelerometer});
      });
      subscriptionGyroscope = gyroscope.subscribe(({ x, y, z, timestamp }) => {
        // let date = new Date(Number(timestamp));
        // datevalues = [
        //  date.getFullYear(),
        //  date.getMonth()+1,
        //  date.getDate(),
        //  date.getHours(),
        //  date.getMinutes(),
        //  date.getSeconds(),
        // ];
        // console.log('gyroscope', { x, y, z, datevalues })
        let { resultsGyroscope } = this.state;
        resultsGyroscope.unshift({x, y, z});
        this.setState({resultsGyroscope});
      });
    });
  }

  stop() {
    console.log('STOP');
    subscriptionAccelerometer.unsubscribe();
    subscriptionGyroscope.unsubscribe();
    this.setState({progress: false})

  }

  selectBox(id) {
    let { checkBoxes, username } = this.state;
    return () => {
      this.setState({checkBoxes: checkBoxes.map( e => {
        e.selected = (e.id === id);
        return e;
      }), lock: (!username)});
    }
  }

  render() {
    const { username, checkBoxes, lock, resultsAccelerometer, resultsGyroscope, progress } = this.state;
// <StatusBar barStyle="dark-content" />
    return (
      <>
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>User Name</Text>
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                  onChangeText={text => this.setState({username: text})}
                  value={username}
                />

                { checkBoxes.map(e => (
                  <CheckBox left
                    key={e.id}
                    title={e.name}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    onPress={this.selectBox(e.id).bind(this)}
                    checked={e.selected}
                  />
                ))}

                {!lock && <Button title="START" onPress={this.start.bind(this)} /> }
                {!lock && <Button title="STOP" color="#f194ff" onPress={this.stop.bind(this)} /> }

                {!lock && (
                  <View style={{flex:1, flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'flex-start' }}>
                    <View style={{flex:0.5}}>
                      <Text>Accelerometer {progress ? <Text>(Progress)</Text> : <Text>(Finish)</Text>}</Text>
                      { resultsAccelerometer.length > 0 && resultsAccelerometer.filter((e,i) => i === 0).map((e,i) => (
                        <View key={`A${i}`} >
                         <Text>{`x:${e.x}`}</Text>
                         <Text>{`y:${e.y}`}</Text>
                         <Text>{`z:${e.z}`}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={{flex:0.5}}>
                      <Text>Gyroscope {progress ? <Text>(Progress)</Text> : <Text>(Finish)</Text>}</Text>
                      { resultsGyroscope.length > 0 && resultsGyroscope.filter((e,i) => i === 0).map((e,i) => (
                        <View key={`G${i}`} >
                         <Text>{`x:${e.x}`}</Text>
                         <Text>{`y:${e.y}`}</Text>
                         <Text>{`z:${e.z}`}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

// resultsAccelerometer.map((e,i) => (
//   <View key={`child${i}`} >
//    <Text key={`x${i}`}>{`x:${e.x}`}</Text>
//    <Text key={`y${i}`}>{`y:${e.y}`}</Text>
//    <Text key={`z${i}`}>{`z:${e.z}`}</Text>
//   </View>
// ))

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
});

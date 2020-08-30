import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Key from './components/Key.component';


export default function App() {
  return (
    <View style={styles.container}>
      
      <Key note="C"/>
      <Key note="D"/>
      <Key note="E"/>
      <Key note="F"/>
      <Key note="G"/>
      <Key note="A"/>
      <Key note="B"/>
      <Key note="C"/>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    alignContent: "stretch",
    // width: "50%",
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

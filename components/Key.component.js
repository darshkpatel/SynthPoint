import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function keyPress(n) {
    console.log(n)
}

export default function Key(props) {
    return (
        <TouchableOpacity 
        style={styles.key} 
        onPress={() => keyPress(props.note)}>
        <Text style={styles.text}>{props.note}</Text>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    key: {
      backgroundColor: "#000000",
      width: "45%",
      margin: 10,
      color: '#ffffff',
      fontSize: 5,
    },
    text: {
        textAlign: "center",
        marginTop: "40%",
        fontSize: 25,
        color: "#FFFFFF"
    }
  });

  
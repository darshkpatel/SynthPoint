import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
var Sound = require('react-native-sound');

function keyPress(n) {
    var note = new Sound(`${n}5.mp3`, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log(error);
        }
        note.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    })

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


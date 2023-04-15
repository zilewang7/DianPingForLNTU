import React from 'react'
import { View, StyleSheet } from 'react-native';
import { MyDormitory } from '../components/threeJS/MyDormitory';


function ModelScreen() {


    return (
        <View style={styles.canteenScreen}>
            <MyDormitory />
        </View>
    )
};


const styles = StyleSheet.create({
    canteenScreen: {
        height: '100%',
    }
})

export default ModelScreen;
import { Button } from '@rneui/themed';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

function MineScreen({ navigation }) {
    return (
        <View>
            <Text>MineScreen</Text>
            <Button title={'登录/注册'} onPress={() => { navigation.navigate('登录/注册'); }} />
        </View>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
import { Button } from '@rneui/themed';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { getItemAsync,  deleteItemAsync } from 'expo-secure-store';

function MineScreen({ navigation }) {
    return (
        <View>
            <Text>MineScreen</Text>
            <Button title={'登录/注册'} onPress={() => { navigation.navigate('登录/注册'); }} />
            <Button title={'kktoken'} onPress={async () => {
                const retrievedValue = await getItemAsync('jwtToken');
                console.log(retrievedValue);
            }} />
            <Button title={'登出'} onPress={() => { 
                deleteItemAsync('jwtToken');
             }} />
        </View>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
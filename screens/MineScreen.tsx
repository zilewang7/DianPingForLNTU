import { Button } from '@rneui/themed';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { useSelector } from '../redux/hook';
import { UserView } from '../components/UserView';
import { clearUserAuth } from '../util/user';

function MineScreen({ navigation }) {
    const userInfo = useSelector(state => state.user);

    return (
        <View>
            <UserView
                isCurrentUser
                username={userInfo.username}
            />
            <Button title={'登录/注册'} onPress={() => { navigation.navigate('登录/注册'); }} />
            <Button title={'kktoken'} onPress={async () => {
                const retrievedValue = await getItemAsync('jwtToken');
                console.log(retrievedValue);
            }} />
            <Button title={'登出'} onPress={() => {
                clearUserAuth();
            }} />
        </View>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
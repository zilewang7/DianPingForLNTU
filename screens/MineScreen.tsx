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
        </View>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
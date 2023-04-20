import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useSelector } from '../redux/hook';
import { clearUserAuth } from '../util/user';


export function HeaderRight() {
    const navigation = useNavigation();
    const userInfo = useSelector(state => state.user);
    const isLogin = userInfo.username !== '未登录';

    return (
        <Pressable onPress={isLogin ? clearUserAuth : navigation.navigate.bind(this, '登录/注册')}>
            <View style={styles.buttonContainer}>
                <Icon name={isLogin ? 'logout' : 'login'} size={16} type="antdesign" />
                <Text> {isLogin && '退出'}登录</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        alignItems: 'center',
        marginRight: 15,
    },
});
import React from 'react'
import { StyleSheet, ScrollView } from 'react-native';
import { useSelector } from '../redux/hook';
import { UserView } from '../components/UserView';

function MineScreen({ navigation }) {
    const userInfo = useSelector(state => state.user);

    return (
        <ScrollView>
            <UserView
                isCurrentUser
                username={userInfo.username}
            />
        </ScrollView>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
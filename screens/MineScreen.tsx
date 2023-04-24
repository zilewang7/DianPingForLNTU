import React from 'react'
import { StyleSheet, ScrollView, View, } from 'react-native';
import { useSelector } from '../redux/hook';
import { UserView } from '../components/UserView';
import { Icon, ListItem } from '@rneui/themed';



function MineScreen({ navigation }) {
    const userInfo = useSelector(state => state.user);

    const list = [
        {
            title: '主题',
            icon: 'skin',
        },
        {
            title: '关于',
            icon: 'ellipsis1',
        },
    ];
    return (
        <ScrollView style={{ flex: 1 }}>
            <UserView
                isCurrentUser
                username={userInfo.username}
                avatarUrl={userInfo.avatarUrl}
            />
            <View style={{}}>
                {
                    list.map((item, index) => (
                        <ListItem
                            key={index}
                            onPress={() => { console.log('onPress') }}
                            bottomDivider
                        >
                            <Icon name={item.icon} type='antdesign' />
                            <ListItem.Content>
                                <ListItem.Title>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))
                }
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
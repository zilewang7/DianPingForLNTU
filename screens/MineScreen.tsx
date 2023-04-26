import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, } from 'react-native';
import { useSelector } from '../redux/hook';
import { UserView } from '../components/UserView';
import { Icon, ListItem } from '@rneui/themed';
import { ModalCard } from '../components/components/modalCard';
import { ThemeComponent } from '../components/Theme';



function MineScreen({ navigation }) {
    const userInfo = useSelector(state => state.user);

    const [modalState, setModalState] = useState(false);


    const list = [
        {
            title: '主题',
            icon: 'skin',
            onPress: () => {
                setModalState(true)
            }
        },
        {
            title: '关于',
            icon: 'ellipsis1',
            onPress: () => {

            }
        },
    ];
    return (
        <>
            <ScrollView style={{ flex: 1 }}>
                <UserView
                    isCurrentUser
                    username={userInfo.username}
                    avatarUrl={userInfo.avatarUrl} />
                <View style={{}}>
                    {list.map((item, index) => (
                        <ListItem
                            key={index}
                            onPress={item.onPress}
                            bottomDivider
                        >
                            <Icon name={item.icon} type='antdesign' />
                            <ListItem.Content>
                                <ListItem.Title>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))}
                </View>
            </ScrollView>
            <ModalCard
                visible={modalState}
                animationType="slide"
                onRequestClose={setModalState.bind(this, false)}
                transparent={true}
                touchOutOfCard={setModalState.bind(this, false)}
            >
                <ThemeComponent />
            </ModalCard>
        </>
    )
};

const styles = StyleSheet.create({

})

export default MineScreen;
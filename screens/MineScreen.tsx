import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native';
import { useSelector } from '../redux/hook';
import { UserView } from '../components/UserView';
import { Icon, ListItem, Tab, TabView, Text } from '@rneui/themed';
import { ModalCard } from '../components/components/modalCard';
import { ThemeComponent } from '../components/Theme';
import { StarBusinessList } from '../components/UserInfo/StarBusinessList';
import { StarPostList } from '../components/UserInfo/StarPostList';



function MineScreen({ navigation }) {
    const userInfo = useSelector(state => state.user);

    const [modalState, setModalState] = useState(false);
    const [index, setIndex] = React.useState(0);


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
            <ScrollView
                contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
            >
                <UserView
                    isCurrentUser
                    userInfo={userInfo}
                    navigation={navigation}
                />
                <View style={{ flex: 1 }}>
                    <Tab
                        value={index}
                        onChange={(e) => setIndex(e)}
                        style={{}}
                    >
                        <Tab.Item title="收藏的店铺" />
                        <Tab.Item title="收藏的帖子" />
                    </Tab>
                    {
                        userInfo._id ? (
                            <TabView value={index} onChange={setIndex} animationType="spring">
                                <TabView.Item style={{ width: '100%' }}>
                                    {
                                        userInfo?.starBusiness.length ?
                                            <StarBusinessList starBusiness={userInfo?.starBusiness} navigation={navigation} />
                                            :
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text>还没有收藏的店铺</Text>
                                            </View>
                                    }
                                </TabView.Item>
                                <TabView.Item style={{ width: '100%' }}>
                                    {
                                        userInfo?.starPost.length ?
                                            <StarPostList starPost={userInfo?.starPost} navigation={navigation} />
                                            :
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text>还没有收藏的帖子</Text>
                                            </View>
                                    }
                                </TabView.Item>
                            </TabView>
                        ) : <></>
                    }

                </View>
                <View style={{}}>
                    {list.map((item, index) => (
                        <ListItem
                            key={index}
                            onPress={item.onPress}
                            topDivider
                        >
                            <Icon name={item.icon} type='antdesign' />
                            <ListItem.Content>
                                <ListItem.Title>{item.title}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    ))}
                </View>
            </ScrollView >
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
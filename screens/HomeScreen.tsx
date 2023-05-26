import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BusinessList } from '../components/BusinessList';
import { Divider, Icon, Text } from '@rneui/themed';

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.mainInnerContainer}>
                {[
                    {
                        name: '吃什么',
                        icon: 'fast-food-outline',
                        type: 'ionicon',
                        onPress: () => {
                            navigation.navigate('吃什么')
                        }
                    },
                    {
                        name: '店铺动态',
                        icon: 'news',
                        type: 'entypo',
                        onPress: () => {
                            navigation.navigate('动态', 'business')
                        }
                    },
                    {
                        name: '关注动态',
                        icon: 'post-add',
                        type: 'material',
                        onPress: () => {
                            navigation.navigate('动态', 'follow')
                        }
                    },
                ].map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.name}
                            onPress={item.onPress}
                        >
                            <Icon name={item.icon} type={item.type} size={35} />
                            <Text style={{ marginTop: 5, fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                })
                }
            </View>
            <Divider />
            <View style={{ flex: 1 }}>
                <BusinessList navigation={navigation} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    mainInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
    }
})

export default HomeScreen;
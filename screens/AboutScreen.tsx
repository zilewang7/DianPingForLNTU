import React from 'react'
import * as Application from 'expo-application';
import { Linking, View } from 'react-native'
import { ListItem, Icon, Text } from '@rneui/themed';


export function AboutScreen() {
    const appVersion = Application.nativeApplicationVersion;

    const list = [
        {
            title: 'github',
            icon: 'github',
            content: 'zilewang7/DianPingForLNTU',
            onPress: () => {
                Linking.openURL('https://github.com/zilewang7/DianPingForLNTU#readme')
            }
        },
        {
            title: 'bug/建议',
            icon: 'tags',
            content: '提 issue',
            onPress: () => {
                Linking.openURL('https://github.com/zilewang7/DianPingForLNTU/issues/new')
            }
        },
        {
            title: '交流群',
            icon: 'QQ',
            content: 'QQ：832775185',
            onPress: () => {
                Linking.openURL('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=jnnDKUldqvn9lJCX_t2GQ2WAa8RmuA1q&authKey=4j1RCsiTkZbJCChOD9Mhi9AqY2cAo%2FnSOiMGxpoRXzLAyfx50WP6RPe7u3TbCSPZ&noverify=0&group_code=832775185')
            }
        },
        {
            title: '更新',
            icon: 'cloudupload',
            content: '暂未上架',
            onPress: () => {
            }
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text h2>工大点评</Text>
                <Text>v{appVersion}</Text>
            </View>
            <View>
                {list.map((item, index) => (
                    <ListItem
                        key={index}
                        onPress={item.onPress}
                        topDivider
                    >
                        <Icon name={item.icon} type='antdesign' />
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                            <Text>{item.content}</Text>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))}
            </View>
        </View>
    )
}

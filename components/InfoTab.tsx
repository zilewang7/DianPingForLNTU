import { Tab, TabView, ListItem, Badge, Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React from 'react'
import { Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export function InfoTab() {

    const [index, setIndex] = React.useState(0);
    const { theme } = useTheme();

    const scrollRef = React.useRef<ScrollView>(null);

    const ScreenWidth = Dimensions.get('window').width;

    return (

        <>
            <Tab
                value={index}
                onChange={(e) => {
                    setIndex(e);
                    scrollRef.current?.scrollTo({
                        x: ScreenWidth * e,
                    });
                }}
                indicatorStyle={{
                    backgroundColor: theme.colors.primary,
                }}
                style={{ backgroundColor: theme.colors.background }}
            >
                {
                    ['点评', '收藏', '关注', '粉丝'].map((val, index, _arr) => {
                        return (
                            <Tab.Item
                                key={index}
                                title={val}
                                titleStyle={(act) => {
                                    if (act) {
                                        return {
                                            color: theme.colors.primary,
                                        }
                                    }
                                    return {
                                        color: "#000",
                                    }
                                }}
                                containerStyle={{ backgroundColor: 'transparent' }}
                            />
                        )
                    })
                }
            </Tab>
            <TabView value={index} onChange={setIndex}>
                {
                    ['点评', '收藏', '关注', '粉丝'].map((val, index, _arr) => {
                        return (
                            <View style={{
                                flex: 1,
                                width: ScreenWidth,
                            }} key={index}>
                                <ScrollView nestedScrollEnabled scrollEventThrottle={16}>
                                    {[...new Array(15)].map((v, i) => (
                                        <ListItem key={i} bottomDivider onPress={() => { }}>
                                            <ListItem.Content>
                                                <ListItem.Title>
                                                    <Text>John Doe</Text>
                                                </ListItem.Title>
                                                <View>
                                                    <Text>I am using React Native Elements</Text>
                                                </View>
                                            </ListItem.Content>
                                            <Badge
                                                value={i * 2 + 3}
                                                badgeStyle={{
                                                    backgroundColor: '#25D366',
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </ScrollView>
                            </View>
                        )
                    })
                }
            </TabView>
        </>
    )
}

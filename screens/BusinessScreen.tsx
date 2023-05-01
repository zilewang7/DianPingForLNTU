import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Platform, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { MyImageViewer } from '../components/components/imgVIewer';
import { Button, Icon, useTheme } from '@rneui/themed';

function BusinessScreen({ navigation }) {
    const { theme } = useTheme();
    const params: any = useRoute().params;

    const { address, name, pictureUrl, posts } = params.business;

    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: `${name}( ${params.placeText})`,
        });
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <Image
                style={{ width: '100%', height: innerWidth / 4 * 3 }}
                source={pictureUrl}
            />
            <MyImageViewer
                visible={imageViewerVisible}
                onCancel={setImageViewerVisible.bind(this, false)}
                images={[{ url: pictureUrl }]}
            />
            <FlatList
                data={[0, 1, 2, 3]}
                style={{ marginTop: -(innerWidth / 4 * 3) }}
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={(event) => {
                    const { velocity, contentOffset } = event.nativeEvent;
                    if (Platform.OS === "ios") {
                        velocity.y = -velocity.y;
                    }

                    if (velocity.y > 0 && contentOffset.y <= 0) {
                        setImageViewerVisible(true)
                    }
                }}
                ListHeaderComponent={
                    <>
                        <Pressable
                            style={{ width: '100%', height: innerWidth / 4 * 2, zIndex: 1 }}
                            onPress={setImageViewerVisible.bind(this, true)}
                        />
                        <View style={{
                            height: 500,
                            backgroundColor: theme.colors.background,
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25
                        }}>

                        </View>
                    </>
                }
                renderItem={(item) => {
                    return <View style={{ height: 500, backgroundColor: theme.colors.background }}></View>
                }}
            />
            <View style={{
                flexDirection: 'row',
                height: 60,
                backgroundColor: theme.colors.grey5,
            }}>
                <View style={{
                    flexDirection: 'row',
                    width: '60%',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    paddingHorizontal: 15
                }}>
                    {
                        [
                            { title: '收藏', icon: 'staro', onPress: () => { } },
                            { title: '位置', icon: 'CodeSandbox', onPress: () => { } },
                            { title: '分享', icon: 'sharealt', onPress: () => { } },
                        ].map((item) => (
                            <Pressable onPress={item.onPress}>
                                <Icon name={item.icon} type='antdesign' />
                                <Text style={{ fontSize: 12, marginTop: 4 }}>{item.title}</Text>
                            </Pressable>
                        ))
                    }
                </View>
                <Button
                    containerStyle={{ width: '40%', justifyContent: 'center', paddingRight: 20 }}
                    buttonStyle={{ borderRadius: 10, height: 45, justifyContent: 'center' }}
                >
                    <Icon name="edit" type='antdesign' />
                    <Text> 我要点评</Text>
                </Button>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({

})

export default BusinessScreen;
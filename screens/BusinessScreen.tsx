import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Pressable, Platform, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Button, Icon, useTheme, Text } from '@rneui/themed';
import * as Sharing from 'expo-sharing';
import { MyImageViewer } from '../components/components/imgVIewer';
import { addBusinessStar } from '../api/business.api';
import { updateUser } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from '../redux/hook';
import { captureRef } from 'react-native-view-shot';
import { ScreenHeight } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import { hexToRgba } from '../util/color';


function BusinessScreen({ navigation }) {
    const { theme } = useTheme();
    const params: any = useRoute().params;
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user);
    const headerHeight = useHeaderHeight();

    const viewShotRef = useRef<any>();

    const { address, name, pictureUrl, posts } = params.business;

    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [onScreenShot, setScreenShot] = useState(false);
    const [headerAlpha, setHeaderAlpha] = useState(0);

    const isStar = userInfo.starBusiness?.includes(address);
    useEffect(() => {
        navigation.setOptions({
            title: `${name}( ${params.placeText})`,
        });
    }, []);
    return (
        <View style={{ flex: 1 }} ref={viewShotRef}>
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
                onScroll={(event) => {
                    const { contentOffset } = event.nativeEvent;
                    if (contentOffset.y < (innerWidth / 2)) {
                        setHeaderAlpha(contentOffset.y / (innerWidth / 2))
                    } else {
                        setHeaderAlpha(1)
                    }
                }}
                ListHeaderComponent={
                    <View
                        style={{
                            height: headerHeight,
                            backgroundColor: hexToRgba(theme.colors.background, (headerAlpha).toString()),
                            ...(headerAlpha === 1) ? {
                                elevation: 4,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            } : {}
                        }}
                    />
                }
                stickyHeaderIndices={[0]}
                renderItem={(item) => {
                    if (item.index === 0) {
                        return (
                            <>
                                <Pressable
                                    style={{ width: '100%', height: innerWidth / 2, zIndex: 1 }}
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
                        )
                    }
                    return <View style={{ height: 500, backgroundColor: theme.colors.background }}>
                        <Text>
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                            内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                        </Text>
                    </View>
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
                            {
                                title: '收藏',
                                icon: isStar ? 'star' : 'staro',
                                color: isStar ? '#f7b129' : undefined,
                                onPress: async () => {
                                    dispatch(updateUser((await addBusinessStar(address)).json))
                                }
                            },
                            {
                                title: '位置', icon: 'CodeSandbox', onPress: () => {
                                    navigation.navigate('食堂', { address });
                                }
                            },
                            {
                                title: '分享', icon: 'sharealt', onPress: async () => {
                                    try {
                                        setScreenShot(true);
                                        await new Promise(resolve => setTimeout(resolve)); // 等待渲染完成
                                        const uri = await captureRef(viewShotRef,
                                            { fileName: `${name}(${params.placeText})by工大点评` }
                                        )
                                        await Sharing.shareAsync('file://' + uri);
                                    } catch (error) {
                                        console.error(error);
                                    } finally {
                                        setScreenShot(false);
                                    }
                                }
                            },
                        ].map((item) => (
                            <Pressable onPress={item.onPress}>
                                <Icon name={item.icon} type='antdesign' color={item.color} />
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
            {
                onScreenShot && (
                    <View style={{
                        height: ScreenHeight * 0.3,
                        marginTop: - ScreenHeight * 0.3,
                        zIndex: 100,
                    }}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                            style={{ height: ScreenHeight * 0.15, padding: 0, margin: 0 }}
                        />
                        <View style={{
                            flex: 1,
                            height: ScreenHeight * 0.15 + 1,
                            marginTop: -1,
                            backgroundColor: 'white',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            <View>
                                <Text h3>工大点评</Text>
                                <Text style={{ margin: 5 }}>{name} - {params.placeText}</Text>
                            </View>
                            <View>
                                <Text>我是二维码</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        </View >
    )
};

const styles = StyleSheet.create({

})

export default BusinessScreen;
import React, { useRef, useState } from 'react'
import StaggeredList from '@mindinventory/react-native-stagger-view';
import { Text, useTheme } from '@rneui/themed'
import { useRoute } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScreenHeight } from '@rneui/base';
import { View, Platform, Pressable } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { MyImageViewer } from '../components/components/imgVIewer';
import { hexToRgba } from '../util/color';
import { ScreenShotBottom } from '../components/components/screenShotBottom';

export function PostScreen() {
    const postInfo: any = useRoute().params;
    const { theme } = useTheme();

    const { rating, comments = [] } = postInfo;

    const headerHeight = useHeaderHeight();

    const viewShotRef = useRef<any>();
    const headerRef = useRef<any>(0);

    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [onScreenShot, setScreenShot] = useState(false);

    const shortRating = parseInt((rating * 10).toString()) / 10

    return (
        <View style={{ flex: 1 }} ref={viewShotRef}>
            <View
                // ref={headerRef}
                style={{
                    height: headerHeight,
                    marginBottom: -headerHeight,
                    zIndex: 100,
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={4}
                onScroll={(event) => {
                    const { contentOffset } = event.nativeEvent;
                    if (contentOffset.y < (innerWidth / 2 - headerHeight)) {
                        headerRef?.current.setNativeProps({
                            style: {
                                backgroundColor: hexToRgba(theme.colors.background, (contentOffset.y / (innerWidth / 2 - headerHeight)).toString()),
                                elevation: null,
                                shadowOffset: null,
                                shadowOpacity: null,
                                shadowRadius: null,
                            }
                        })
                    } else {
                        headerRef?.current.setNativeProps({
                            style: {
                                backgroundColor: hexToRgba(theme.colors.background, '1'),
                                elevation: 4,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            }
                        })
                    }
                }}
                style={{ marginTop: -(innerWidth / 4 * 3) }}
            >
                <>
                    {
                        // ImageList
                    }
                    <MyImageViewer
                        visible={imageViewerVisible}
                        onCancel={setImageViewerVisible.bind(this, false)}
                        images={[]}
                        index={0}
                    />
                    <Pressable
                        style={{ width: '100%', height: innerWidth / 2, zIndex: 1 }}
                        onPress={setImageViewerVisible.bind(this, true)}
                    />
                    {
                        comments.length ?
                            (
                                <StaggeredList
                                    style={{ backgroundColor: theme.colors.background, }}
                                    animationType='EFFECTIVE'
                                    data={[]}
                                    renderItem={({ item }) => <></>}
                                />
                            )
                            : (
                                <View style={{
                                    height: ScreenHeight - (Platform.OS === "ios" ? 120 : headerHeight) - 75,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: theme.colors.background,
                                }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text h4>暂无回复</Text>
                                        <TouchableOpacity onPress={() => { }}><Text>说点什么 &gt;</Text></TouchableOpacity>
                                    </View>
                                </View>
                            )
                    }
                    <View style={{
                        backgroundColor: theme.colors.background,
                        alignItems: 'center',
                        height: 200,
                        marginBottom: -200,
                    }}>
                        <Text h3 style={{ marginTop: 10 }}>我是有底线的</Text>
                    </View>
                </>
            </ScrollView>
            <View style={{
                flexDirection: 'row',
                height: 60,
                backgroundColor: theme.colors.background,
            }}>
                <Text>底部工具</Text>
            </View>
            {
                onScreenShot && (
                    <ScreenShotBottom ScreenHeight={ScreenHeight} content={``} />
                )
            }
        </View >
    )
}

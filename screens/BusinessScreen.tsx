import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Pressable, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Button, Icon, useTheme, Text, Divider } from '@rneui/themed';
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
import StarRating from 'react-native-star-rating-widget';


function BusinessScreen({ navigation }) {
    const { theme } = useTheme();
    const params: any = useRoute().params;
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user);
    const headerHeight = useHeaderHeight();

    const viewShotRef = useRef<any>();

    const { address, name, pictureUrl, type, rating, posts = [] } = params.business;

    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [onScreenShot, setScreenShot] = useState(false);
    const [headerAlpha, setHeaderAlpha] = useState(0);
    const [ratingValue, setRatingValue] = useState(rating);
    const [isUserRating, setIsUserRating] = useState(false);

    const isStar = userInfo.starBusiness?.includes(address);

    const onRatingChange = (rating) => {
        setIsUserRating(true);
        setRatingValue(rating < 0.5 ? 0.5 : rating)
    }

    const startRating = () => {
        navigation.navigate('发布点评', { address, rating: isUserRating ? ratingValue : 5 });
    };

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
                data={['header', ...posts]}
                keyExtractor={item => item}
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
                renderItem={({ index }) => {
                    if (index === 0) {
                        return (
                            <>
                                <Pressable
                                    style={{ width: '100%', height: innerWidth / 2 - headerHeight, zIndex: 1 }}
                                    onPress={setImageViewerVisible.bind(this, true)}
                                />
                                <View style={{
                                    backgroundColor: theme.colors.background,
                                    borderTopLeftRadius: 25,
                                    borderTopRightRadius: 25,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                }}>
                                    <Text h2>{name}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            [params.placeText, type, rating ? `${rating}分` : '暂无评分'].map(text => (
                                                <Text
                                                    key={text}
                                                    style={{
                                                        alignSelf: 'flex-start',
                                                        paddingHorizontal: 4,
                                                        borderRadius: 5,
                                                        backgroundColor: hexToRgba(theme.colors.primary, '0.15'),
                                                        color: theme.colors.primary,
                                                        overflow: 'hidden',
                                                        marginRight: 5,
                                                    }}
                                                >
                                                    {text}
                                                </Text>)
                                            )
                                        }

                                    </View>
                                    <Divider style={{ marginVertical: 10 }} />
                                    <View style={{ alignItems: 'center', }}>
                                        <Text h4>{isUserRating && '我的'}评分：{ratingValue || '暂无'}</Text>
                                        {
                                            isUserRating &&
                                            <TouchableOpacity style={{ position: 'absolute', flexDirection: 'row', right: 0, bottom: 5 }} onPress={startRating}>
                                                <Text style={{ fontSize: 15 }}>发布</Text>
                                                <Icon name='right' type='antdesign' size={18} />
                                            </TouchableOpacity>
                                        }
                                        <StarRating
                                            rating={ratingValue}
                                            style={{ marginTop: 5 }}
                                            color={ratingValue ? undefined : theme.colors.disabled}
                                            onChange={onRatingChange}
                                        />
                                    </View>
                                    <Divider style={{ marginVertical: 10, marginHorizontal: -15 }} />
                                    <Text h4>用户评价</Text>
                                    {
                                        posts.length ?
                                            (
                                                <></>
                                            )
                                            : (
                                                <View style={{
                                                    height: ScreenHeight - (Platform.OS === "ios" ? 120 : headerHeight) - 75,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Text h4>暂无评价</Text>
                                                        <TouchableOpacity onPress={() => startRating()}><Text>为这家店添加首个评价 &gt;</Text></TouchableOpacity>
                                                    </View>
                                                </View>
                                            )
                                    }
                                </View>
                            </>
                        )
                    }
                    return <View key={index} style={{ height: 500, backgroundColor: theme.colors.background }}>
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
                            <TouchableOpacity key={item.title} onPress={item.onPress}>
                                <Icon name={item.icon} type='antdesign' color={item.color} />
                                <Text style={{ fontSize: 12, marginTop: 4 }}>{item.title}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <Button
                    containerStyle={{ width: '40%', justifyContent: 'center', paddingRight: 20 }}
                    buttonStyle={{ borderRadius: 10, height: 45, justifyContent: 'center' }}
                    onPress={() => startRating()}
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
                            colors={[hexToRgba(theme.colors.background, '0'), hexToRgba(theme.colors.background, '1')]}
                            style={{ height: ScreenHeight * 0.15, padding: 0, margin: 0 }}
                        />
                        <View style={{
                            flex: 1,
                            height: ScreenHeight * 0.15 + 1,
                            marginTop: -1,
                            backgroundColor: theme.colors.background,
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
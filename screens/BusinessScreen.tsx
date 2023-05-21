import React, { useEffect, useRef, useState } from 'react'
import * as Sharing from 'expo-sharing';
import StaggeredList from '@mindinventory/react-native-stagger-view';
import StarRating from 'react-native-star-rating-widget';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useDispatch } from 'react-redux';
import { captureRef } from 'react-native-view-shot';
import { ScreenHeight } from '@rneui/base';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView } from 'react-native-gesture-handler';
import { clone, sortBy } from 'lodash';
import { Button, Icon, useTheme, Text, Divider } from '@rneui/themed';
import { View, StyleSheet, Pressable, Platform, TouchableOpacity } from 'react-native';
import { MyImageViewer } from '../components/components/imgVIewer';
import { addBusinessStar } from '../api/business.api';
import { updateUser } from '../redux/slices/userSlice';
import { useSelector } from '../redux/hook';
import { hexToRgba } from '../util/color';
import { PostListBox } from '../components/PostListBox';
import { getPosts } from '../api/post.api';
import { ScreenShotBottom } from '../components/components/screenShotBottom';
import { PostSortList } from '../constants/business';


function BusinessScreen({ navigation }) {
    const { theme } = useTheme();
    const params: any = useRoute().params;
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user);
    const headerHeight = useHeaderHeight();

    const viewShotRef = useRef<any>();
    const headerRef = useRef<any>();

    const { address, name, pictureUrl, type, rating, posts = [] } = params.business;

    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [onScreenShot, setScreenShot] = useState(false);
    const [ratingValue, setRatingValue] = useState(rating);
    const [isUserRating, setIsUserRating] = useState(false);
    const [originPostInfo, setOriginPostInfo] = useState([]);
    const [postsInfo, setPostsInfo] = useState([]);
    const [sortList, setSortList] = useState(PostSortList.reduce((acc, val) => { acc[val] = undefined; return acc; }, {}));

    const isStar = userInfo.starBusiness?.includes(address);

    const shortRating = parseInt((rating * 10).toString()) / 10

    const onRatingChange = (rating) => {
        setIsUserRating(true);
        setRatingValue(rating < 0.5 ? 0.5 : rating)
    }

    const startRating = () => {
        navigation.navigate('发布点评', {
            address,
            rating: isUserRating ? ratingValue : undefined,
            placeText: `${name}( ${params.placeText})`,
            refreshBusiness: params.refreshBusiness,
            backToBusiness: params.backToBusiness,
        });
    };

    const getPostsInfo = () => {
        getPosts({ posts }).then((res) => {
            if (res.ok) {
                const sortByUid = sortBy(res.json, (o) => -Number(o.uid))
                setOriginPostInfo(sortByUid)
                setPostsInfo(sortByUid)
            }
        }).catch((err) => { console.error(err) })
    }
    const onSortChange = async (sort) => {
        let sortState;
        if (sortList[sort] !== undefined) {
            if (sortList[sort] === 1) {
                setSortList(list => ({
                    ...list,
                    [sort]: 0,
                }))
                sortState = 0;
            } else {
                setSortList(PostSortList.reduce((acc, val) => { acc[val] = undefined; return acc; }, {}));
                setPostsInfo([]);
                setTimeout(() => { setPostsInfo(originPostInfo); })
                return;
            }
        } else {
            setSortList(PostSortList.reduce((acc, val) => {
                acc[val] = val === sort ? 1 : undefined;
                return acc;
            }, {}));
            sortState = 1;
        }

        setPostsInfo([]);
        const sortedPosts = sortBy(originPostInfo,
            (o) => {
                switch (sort) {
                    case '发布':
                        return Number(o.uid);
                    case '回复':
                        return Date.parse(o.commentsUpdatedAt);
                    case '顶':
                        return o.up.length;
                    case '踩':
                        return o.down.length;
                    case '评分':
                        return o.rating;
                    default:
                        return undefined;
                }
            }
        );
        setTimeout(() => {
            setPostsInfo(sortState ? sortedPosts.reverse() : sortedPosts)
        })
    }

    useEffect(() => {
        getPostsInfo();
    }, [JSON.stringify(posts)])

    useEffect(() => {
        navigation.setOptions({
            title: `${name}( ${params.placeText})`,
        });
    }, []);
    useEffect(() => {
        setRatingValue(rating);
        setIsUserRating(false);
    }, [rating]);
    return (
        <View style={{ flex: 1 }} ref={viewShotRef}>
            <View
                ref={headerRef}
                style={{
                    height: headerHeight,
                    marginBottom: -headerHeight,
                    zIndex: 100,
                }}
            />
            <Image
                style={{ width: '100%', height: innerWidth / 4 * 3 }}
                source={pictureUrl}
            />
            <MyImageViewer
                visible={imageViewerVisible}
                onCancel={setImageViewerVisible.bind(this, false)}
                images={[{ url: pictureUrl }]}
            />
            <ScrollView
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
                    <Pressable
                        style={{ width: '100%', height: innerWidth / 2, zIndex: 1 }}
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
                                [params.placeText, type, rating ? `${shortRating}分` : '暂无评分'].map(text => (
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
                            <Text h4>{isUserRating ? ('我的评分：' + ratingValue) : ('评分：' + (rating ? shortRating : '暂无'))}</Text>
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
                    </View>
                    <View style={{ backgroundColor: theme.colors.background, }}>
                        {
                            posts.length ?
                                (
                                    <StaggeredList
                                        animationType='EFFECTIVE'
                                        data={postsInfo}
                                        ListHeaderComponent={(
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                paddingVertical: 4,
                                            }}>
                                                {
                                                    PostSortList.map(sort => {
                                                        const isOnSort = sortList[sort] !== undefined;
                                                        return (
                                                            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { onSortChange(sort) }}>
                                                                <Icon name={isOnSort ? ['sort-down', 'sort-up'][sortList[sort]] : 'sort'}
                                                                    type='font-awesome'
                                                                    size={18}
                                                                    color={isOnSort ? theme.colors.primary : theme.colors.grey4}
                                                                /><Text> {sort}</Text>
                                                            </Pressable>
                                                        )
                                                    })
                                                }
                                            </View>
                                        )}
                                        renderItem={({ item }) => <PostListBox postInfo={item} navigation={navigation} />}
                                    />
                                )
                                : (
                                    <View style={{
                                        height: ScreenHeight - (Platform.OS === "ios" ? 120 : headerHeight) - 75,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text h4>暂无评价</Text>
                                            <TouchableOpacity onPress={() => startRating()}><Text>为这家店添加首个评价 &gt;</Text></TouchableOpacity>
                                        </View>
                                    </View>
                                )
                        }
                        <View style={{
                            alignItems: 'center',
                            height: 200,
                            marginBottom: -200,
                        }}>
                            <Text h3 style={{ marginTop: 10 }}>我是有底线的</Text>
                        </View>
                    </View>
                </>
            </ScrollView>
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
                    <ScreenShotBottom ScreenHeight={ScreenHeight} content={`${name} - ${params.placeText}`} />
                )
            }
        </View >
    )
};

const styles = StyleSheet.create({

})

export default BusinessScreen;
import React from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Icon, Text, useTheme } from '@rneui/themed'
import { Image } from 'expo-image'
import { useSelector } from '../../redux/hook'
import { hexToRgba } from '../../util/color'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { addBusinessStar } from '../../api/business.api'
import { updateUser } from '../../redux/slices/userSlice'
import { useDispatch } from 'react-redux'

export function StarBusinessList({ starBusiness, navigation }) {
    const { theme } = useTheme();
    const business = useSelector(state => state.business.businessList);
    const userInfo = useSelector(state => state.user);
    const { setCurrentBusiness } = useSelector(state => state.business.helper);
    const dispatch = useDispatch()

    return (
        <ScrollView>
            {
                starBusiness.map((currentAddress => {
                    const currentBusiness = business.find(({ address }) => address === currentAddress)
                    const { name, pictureUrl, type, rating } = currentBusiness


                    const place = currentAddress.split('-');
                    const placeText = `${place[0]} 食堂 ${place[1]} 楼`;
                    const shortRating = parseInt((rating * 10).toString()) / 10

                    const isStar = userInfo.starBusiness.includes(currentAddress);

                    return (
                        <Pressable
                            key={currentAddress}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 8,
                                marginHorizontal: 8,
                                marginVertical: 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                const place = currentBusiness.address.split('-');
                                const placeText = `${place[0]} 食堂 ${place[1]} 楼`;
                                setCurrentBusiness(currentBusiness.address)
                                setTimeout(() => {
                                    navigation.navigate("商家", { business: currentBusiness, placeText });
                                })
                            }}
                        >
                            <Image
                                style={{ width: 75, height: 75, borderRadius: 8, overflow: 'hidden' }}
                                source={pictureUrl + '?x-oss-process=image/resize,h_200,m_lfit'}
                            />
                            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                <Text h4>{name}</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    {
                                        [placeText, type, rating ? `${shortRating}分` : '暂无评分'].map(text => (
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
                                <StarRatingDisplay
                                    rating={rating || 5}
                                    starSize={25}
                                    color={rating ? undefined : theme.colors.grey4}
                                    starStyle={{ marginHorizontal: 0 }}
                                />
                            </View>
                            <Icon type='antdesign'
                                name={isStar ? 'star' : 'staro'}
                                color='#f7b129'
                                size={28}
                                style={{ margin: 10 }}
                                onPress={async () => {
                                    dispatch(updateUser((await addBusinessStar(currentAddress)).json))
                                }} />
                        </Pressable>
                    )
                }))
            }
        </ScrollView>
    )
}
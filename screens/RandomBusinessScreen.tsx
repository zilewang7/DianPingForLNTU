import React, { useState } from 'react'
import { useSelector } from '../redux/hook'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { Button, ButtonGroup, Text, useTheme } from '@rneui/themed'
import { StarRatingDisplay } from 'react-native-star-rating-widget'
import { sample } from 'lodash'
import { hexToRgba } from '../util/color'
import { Business } from '../redux/slices/businessSlice'
import { ScreenHeight, ScreenWidth } from '@rneui/base'
import { BusinessFilterList } from '../constants/business'
import { produce } from 'immer'

export function RandomBusinessScreen({ navigation }) {
    const { theme } = useTheme()

    const businessList = useSelector(state => state.business.businessList)
    const { setCurrentBusiness } = useSelector(state => state.business.helper)

    const [selectedRestaurant, setSelectedRestaurant] = useState<Business>();

    const [filterList, setFilterList] = useState(BusinessFilterList.map((filter) => {
        const arr = [];
        filter.option.forEach((_, index) => {
            arr.push(index)
        })
        return arr;
    }));

    const place = selectedRestaurant?.address.split('-');

    const randomBusiness = () => {
        const filterNameArr = filterList.map((indexArr, index) => {
            const filterArr = [];
            BusinessFilterList[index].option.forEach((value, index) => {
                if (indexArr.includes(index)) {
                    filterArr.push(value);
                }
            })
            return filterArr;
        })
        filterNameArr[0].forEach((v, i) => {
            filterNameArr[0][i] = (v[0] === '一' ? '1' : '2') + '-' + (v.match(/(\d+(\.\d+)?)楼/)[1]).toString() + '-';
        })
        filterNameArr[2].forEach((v, i) => {
            filterNameArr[2][i] = isNaN(v[1]) ? '0' : v[1];
        })
        console.log(filterList, filterNameArr);

        const businessListWithFilter = businessList.filter((business) => {
            const stateArr = filterNameArr.map((filter, index) => {

            })
            return true;
        })
        setSelectedRestaurant(sample(businessListWithFilter))
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingTop: 30, paddingBottom: 50 }}>
            <View style={{ alignItems: 'center' }}>
                <Text h4>筛选（长按全选）</Text>
                {
                    BusinessFilterList.map((filter, index) => {
                        return (
                            <View
                                key={filter.title}
                                style={{ width: ScreenWidth }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                                    <Text style={{ fontSize: 18 }}>{filter.title}</Text>
                                </View>
                                <ButtonGroup
                                    textStyle={{ fontSize: 12, fontWeight: 'bold' }}
                                    buttons={filter.option}
                                    selectMultiple
                                    selectedIndexes={filterList[index]}
                                    onPress={(value) => {
                                        setFilterList(produce((draft) => {
                                            draft[index] = value;
                                        }))
                                    }}
                                    containerStyle={{ marginVertical: 0, marginHorizontal: 0 }}
                                    onLongPress={() => {
                                        if (filterList[index].length < BusinessFilterList[index].option.length) {
                                            setFilterList(produce((draft) => {
                                                const arr = [];
                                                BusinessFilterList[index].option.forEach((_, index) => {
                                                    arr.push(index)
                                                })
                                                draft[index] = arr;
                                            }))
                                        } else {
                                            setFilterList(produce((draft) => {
                                                draft[index] = [];
                                            }))
                                        }
                                    }}
                                />
                            </View>
                        )
                    })
                }
            </View>

            <View>
                {
                    selectedRestaurant ? (
                        <View style={{
                            borderWidth: 1,
                            borderRadius: 10,
                            width: ScreenWidth * 0.8,
                            height: ScreenHeight * 0.3,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            paddingVertical: 30
                        }}>
                            <Text h4>{selectedRestaurant?.name} </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {[selectedRestaurant.type, `${place[0]} 食堂 ${place[1]} 楼`].map((tag) => {
                                    return (
                                        <Text
                                            key={tag}
                                            style={{
                                                alignSelf: 'center',
                                                paddingHorizontal: 4,
                                                borderRadius: 5,
                                                backgroundColor: hexToRgba(theme.colors.primary, '0.15'),
                                                color: theme.colors.primary,
                                                overflow: 'hidden',
                                                marginHorizontal: 5,
                                            }}
                                        >
                                            {tag}
                                        </Text>
                                    )
                                })}
                            </View>
                            <View style={{ alignItems: 'center', marginBottom: 15 }}>
                                <Text h4>评分：{(parseInt((selectedRestaurant?.rating * 10).toString()) / 10) || '暂无'}</Text>
                                <StarRatingDisplay rating={selectedRestaurant?.rating || 0} style={{ marginTop: 5 }} />
                            </View>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                                const place = selectedRestaurant.address.split('-');
                                const placeText = `${place[0]} 食堂 ${place[1]} 楼`;
                                setCurrentBusiness(selectedRestaurant.address)
                                setTimeout(() => {
                                    navigation.navigate("商家", { business: selectedRestaurant, placeText });
                                })
                            }}>
                                <Text h4>进入店铺 &gt;</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{
                            borderWidth: 1,
                            borderRadius: 10,
                            width: ScreenWidth * 0.8,
                            height: ScreenHeight * 0.3,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            <Text h4>点击下方GO！</Text>
                        </View>
                    )
                }
            </View>

            <Button title={'       GO！     '} size='lg' buttonStyle={{ borderRadius: 30 }} onPress={randomBusiness} />
        </View >
    )
}

const styles = StyleSheet.create({
    filterButtonContainer: {
        margin: 10,
    },
    filterButton: {
        backgroundColor: 'rgba(244, 244, 244, 1)',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#aaaaaa'
    },
    filterButtonTitle: {
        color: '#555555',
        fontSize: 14,
    }
})
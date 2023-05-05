import React, { useEffect, useState } from 'react'
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { View, StyleSheet, FlatList, ImageBackground, RefreshControl, Pressable } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { Image } from 'expo-image';
import { ScreenWidth } from '@rneui/base';
import { cloneDeep } from 'lodash';
import { Filter } from './components/filter';
import { hexToRgba } from '../util/color';
import { getBusinessList } from '../api/business.api';
import { BusinessFilterList } from '../constants/business';
import { useDispatch } from 'react-redux';
import { updateBusinessList } from '../redux/slices/businessSlice';


export function BusinessList({ navigation }) {
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const [filter, setFilter] = useState(BusinessFilterList.map((v) => v.option));
    const [filterSelectIndex, setFilterSelectIndex] = useState<number | null>(null);
    const [businessData, setBusinessData] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [currentBusiness, setCurrentBusiness] = useState<any>();

    const onFilterChange = async (newFilter?, index?) => {
        setIsRefresh(true);
        const currentFilter = cloneDeep(filter);
        if (newFilter) {
            currentFilter[index] = newFilter;
            setFilter(currentFilter);
        }

        const transFilter = cloneDeep(currentFilter)
        transFilter[0].forEach((v, i) => {
            transFilter[0][i] = (v[0] === '一' ? '1' : '2') + '-' + (v.match(/(\d+(\.\d+)?)楼/)[1]).toString() + '-';
        })
        transFilter[2].forEach((v, i) => {
            transFilter[2][i] = isNaN(v[1]) ? '0' : v[1];
        })

        const { json } = await getBusinessList(transFilter);
        setBusinessData(json);
        dispatch(updateBusinessList(json));
        setIsRefresh(false)
        return json;
    }

    const refreshBusiness = () => {
        onFilterChange().then((json) => {
            const newBusinessData = json.filter(({ address }) => address === currentBusiness)[0];
            const place = newBusinessData.address.split('-');
            const placeText = `${place[0]} 食堂 ${place[1]} 楼`;
            navigation.navigate("商家", { business: newBusinessData, placeText, refreshBusiness });
        })
    }

    useEffect(() => { onFilterChange() }, [])

    let columnNum = ScreenWidth < 600 ? 1 : 2;
    return (
        <>
            <View style={styles.filterContainer}>
                {BusinessFilterList.map((item, index) => {
                    return (
                        <Filter
                            key={index}
                            index={index}
                            title={item.title}
                            option={item.option}
                            filter={filter[index]}
                            isVisible={filterSelectIndex === index}
                            select={setFilterSelectIndex}
                            close={() => setTimeout(setFilterSelectIndex.bind(this, null), 100)}
                            set={(newFilter: string[]) => {
                                onFilterChange(newFilter, index);
                            }}
                            theme={theme}
                        />
                    )
                })}
            </View>
            <FlatList
                data={businessData}
                // contentContainerStyle={{ paddingBottom: 10, }}
                keyExtractor={item => item.address}
                // columnWrapperStyle={{ flexDirection: 'row' }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        colors={[theme.colors.primary]} //android
                        tintColor={theme.colors.primary} //ios
                        refreshing={isRefresh}
                        onRefresh={() => {
                            onFilterChange();
                        }}
                    />
                }
                numColumns={columnNum}
                onEndReached={() => {
                    // setBusinessData(list => [...list, ...list]);
                }}
                renderItem={({ item }) => {
                    const place = item.address.split('-')
                    const placeText = `${place[0]} 食堂 ${place[1]} 楼`
                    return (
                        <Pressable
                            onPress={() => {
                                setCurrentBusiness(item.address)
                                navigation.navigate("商家", { business: item, placeText, refreshBusiness });
                            }}
                            style={{
                                flexDirection: 'row',
                                marginBottom: 10,
                                marginHorizontal: 5,
                                width: ScreenWidth / columnNum - 10
                            }}
                        >
                            <View style={{ width: '40%', height: (ScreenWidth / columnNum) * 0.3 }}>
                                <ImageBackground
                                    source={require('../assets/Transparent_Akkarin_Transparentized.png')}
                                >
                                    <Image
                                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                        source={item.pictureUrl + '?x-oss-process=image/resize,h_400,m_lfit'}
                                    />
                                </ImageBackground>
                            </View>
                            <View style={{ padding: 10, width: '60%', justifyContent: 'space-between' }}>
                                <Text h4>{item.name}</Text>
                                <Text
                                    style={{
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: 4,
                                        borderRadius: 5,
                                        backgroundColor: hexToRgba(theme.colors.primary, '0.15'),
                                        color: theme.colors.primary,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {placeText}
                                </Text>
                                {
                                    item.rating ? <StarRatingDisplay
                                        rating={item.rating}
                                        starSize={15}
                                        starStyle={{ marginHorizontal: 0 }}
                                    /> : (
                                        <View style={{ flexDirection: 'row' }}>
                                            <StarRatingDisplay
                                                rating={0}
                                                starSize={15}
                                                color={theme.colors.disabled}
                                                starStyle={{ marginHorizontal: 0 }}
                                            />
                                            <Text style={{ fontSize: 12, color: theme.colors.disabled }}> 暂无评分</Text>
                                        </View>
                                    )
                                }
                                <Text style={{ color: hexToRgba(theme.colors.secondary, '0.7'), alignSelf: 'flex-end' }}>{item.type}</Text>
                            </View>
                        </Pressable>
                    )
                }}
                ListFooterComponent={<Text style={{ textAlign: 'center', paddingVertical: 20, marginBottom: -60 }} h4>你到达了没有店的荒原</Text>}
            />
        </>
    )
}


const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 6,
    },
})
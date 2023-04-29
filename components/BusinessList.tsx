import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ImageBackground, RefreshControl } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { Image } from 'expo-image';
import { Filter } from './components/filter';
import { hexToRgba } from '../util/color';
import { getBusinessList } from '../api/business.api';
import { BusinessFilterList } from '../constants/business';


export function BusinessList() {
    const { theme } = useTheme();

    const [filter, setFilter] = useState(BusinessFilterList.map((v) => v.option));
    const [filterSelectIndex, setFilterSelectIndex] = useState<number | null>(null);
    const [businessData, setBusinessData] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);

    const onFilterChange = async (newFilter?, index?) => {
        setIsRefresh(true);
        if (newFilter) {
            setFilter((filter) => {
                filter[index] = newFilter;
                return filter;
            })
        }

        const { json } = await getBusinessList(newFilter);
        setBusinessData(json);
        setIsRefresh(false)
    }

    useEffect(() => { onFilterChange() }, [])

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
                contentContainerStyle={{ paddingBottom: 10, }}
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
                renderItem={({ item, index }) => {
                    const place = item.address.split('-')
                    return (
                        <View style={{ flexDirection: 'row', marginBottom: 10, marginHorizontal: 5 }}>
                            <View style={{ width: '40%', height: innerWidth * 0.3 }}>
                                <ImageBackground
                                    source={require('../assets/Transparent_Akkarin_Transparentized.png')}
                                >
                                    <Image
                                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                        source={item.pictureUrl + '?x-oss-process=image/resize,h_400,m_lfit'}
                                    />
                                </ImageBackground>
                            </View>
                            <View style={{ padding: 10, width: '60%' }}>
                                <Text h4>{item.name}</Text>
                                <Text
                                    style={{
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: 4,
                                        borderRadius: 5,
                                        backgroundColor: hexToRgba(theme.colors.primary, '0.15'),
                                        color: theme.colors.primary,
                                    }}
                                >
                                    {`${place[0]} 食堂 ${place[1]} 楼`}
                                </Text>
                                <Text style={{ color: hexToRgba(theme.colors.secondary, '0.7'), alignSelf: 'flex-end' }}>{item.type}</Text>
                            </View>
                        </View>
                    )
                }}
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
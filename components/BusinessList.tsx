import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { BottomSheet, Button, Icon, Text, ListItem, useTheme } from '@rneui/themed';
import { hexToRgba } from '../util/color';
import { getBusinessList } from '../api/business.api';
import { Image } from 'expo-image';

const FilterList = [
    {
        title: '位置',
        option: [
            '一食堂1楼',
            '一食堂2楼',
            '二食堂1楼',
            '二食堂1.5楼',
            '二食堂2楼',
        ],
    },
    {
        title: '分类',
        option: [
            '快餐简餐',
            '炸鸡汉堡',
            '饺子馄饨',
            '米粉面馆',
            '冒菜干锅',
            '小吃面食',
            '面包饮品',
            '其他',
        ],
    },
];

export function BusinessList() {
    const { theme } = useTheme();

    const [filter, setFilter] = useState(FilterList.map((v) => v.option));
    const [filterSelectIndex, setFilterSelectIndex] = useState<number | null>(null);
    const [businessData, setBusinessData] = useState([]);

    const onFilterChange = async (newFilter?, index?) => {
        if (newFilter) {
            setFilter((filter) => {
                filter[index] = newFilter;
                return filter;
            })
        }

        const { json } = await getBusinessList(newFilter);
        setBusinessData(json);
    }

    useEffect(() => { onFilterChange() }, [])

    return (
        <>
            <View style={styles.filterContainer}>
                {FilterList.map((item, index) => {
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
                contentContainerStyle={{ paddingBottom: 10 }}
                keyExtractor={item => item.address}
                // columnWrapperStyle={{ flexDirection: 'row' }}
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

const Filter = ({ index, title, option, filter, isVisible, select, close, set, theme }) => {
    const [selectList, setSelectList] = useState<string[]>(filter);

    const isAllSelect = selectList.length === option.length;

    const cancel = () => {
        setSelectList(filter);
        close();
    }

    const onSure = () => {
        if (JSON.stringify(selectList.sort()) !== JSON.stringify(filter.sort())) {
            set(selectList);
        }
        close();
    }


    return <>
        <Text
            onPress={select.bind(this, index)}
            style={(isVisible || !isAllSelect) ? { color: theme.colors.primary } : theme.colors.black}
        >
            <Icon
                name="filter"
                type="antdesign" size={12}
                color={(isVisible || !isAllSelect) ? theme.colors.primary : '#555555'}
            /> {title}
        </Text>
        {
            isVisible &&
            <BottomSheet
                modalProps={{
                    onRequestClose: cancel,
                }}
                isVisible={isVisible}
                onBackdropPress={cancel}
            >
                <ListItem>
                    <View>
                        <Button
                            title={'全选'}
                            containerStyle={styles.filterButtonContainer}
                            buttonStyle={
                                isAllSelect ?
                                    {
                                        ...styles.filterButton,
                                        backgroundColor: hexToRgba(theme.colors.primary, '0.3'),
                                        borderColor: theme.colors.primary,
                                    } :
                                    styles.filterButton
                            }
                            titleStyle={{ color: isAllSelect ? theme.colors.primary : 'black' }}
                            onPress={() => {
                                if (isAllSelect) {
                                    setSelectList([]);
                                } else {
                                    setSelectList(option);
                                }
                            }}
                        />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                option.map((name, index) => {
                                    const isSelected = selectList.includes(name);
                                    return <Button
                                        key={index}
                                        size='sm'
                                        title={name}
                                        containerStyle={styles.filterButtonContainer}
                                        buttonStyle={
                                            isSelected ?
                                                {
                                                    ...styles.filterButton,
                                                    backgroundColor: hexToRgba(theme.colors.primary, '0.3'),
                                                    borderColor: theme.colors.primary,
                                                } :
                                                styles.filterButton
                                        }
                                        titleStyle={
                                            isSelected ?
                                                {
                                                    ...styles.filterButtonTitle,
                                                    color: theme.colors.primary,
                                                } :
                                                styles.filterButtonTitle
                                        }
                                        onPress={() => {
                                            if (isSelected) {
                                                setSelectList(selectList.filter(val => val !== name))
                                            } else {
                                                setSelectList(list => [...list, name])
                                            }
                                        }}
                                    />
                                })
                            }
                        </View>
                    </View>
                </ListItem>
                <View style={{ flexDirection: 'row', }}>
                    <Button
                        title="取消"
                        buttonStyle={{
                            backgroundColor: 'rgba(244, 244, 244, 1)',
                            borderRadius: 0,
                        }}
                        containerStyle={{
                            flex: 1,
                            borderRadius: 0,
                        }}
                        titleStyle={{ marginHorizontal: 20, color: 'black' }}
                        size='lg'
                        onPress={cancel}
                    />
                    <Button
                        title="确定"
                        buttonStyle={{
                            borderRadius: 0,
                        }}
                        containerStyle={{
                            flex: 1,
                            borderRadius: 0,
                        }}
                        titleStyle={{ marginHorizontal: 20, color: 'black' }}
                        size='lg'
                        onPress={onSure}
                    />
                </View>
            </BottomSheet>
        }
    </>
}


const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 6,
        shadowColor: 'black',  // ios
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        shadowOpacity: 0.26,

        elevation: 5, // android

        zIndex: 100
    },
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
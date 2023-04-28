import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native';
import { BottomSheet, Button, Icon, Text, ListItem, useTheme } from '@rneui/themed';
import { hexToRgba } from '../util/color';

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
    }
];

export function BusinessList() {
    const { theme } = useTheme();

    const [filer, setFiler] = useState(FilterList.map((v) => v.option));
    const [filterSelectIndex, setFilterSelectIndex] = useState<number | null>(null);

    return (
        <View style={styles.filterContainer}>
            {
                FilterList.map((filter, index) => {
                    return <Filer
                        key={index}
                        index={index}
                        title={filter.title}
                        option={filter.option}
                        filter={filer[index]}
                        isVisible={filterSelectIndex === index}
                        select={setFilterSelectIndex}
                        close={() => setTimeout(setFilterSelectIndex.bind(this, null), 150)}
                        theme={theme}
                    />
                })
            }
        </View>
    )
}

const Filer = ({ index, title, option, filter, isVisible, select, close, theme }) => {
    const [selectList, setSelectList] = useState<string[]>(filter);

    const isAllSelect = selectList.length === option.length;

    const cancel = () => {
        setSelectList(filter);
        close();
    }


    return <>
        <Text
            onPress={select.bind(this, index)}
            style={(isVisible || !isAllSelect) ? { color: theme.colors.primary } : undefined}
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
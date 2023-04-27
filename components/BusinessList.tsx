import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheet, Button, Icon, ListItem, useTheme } from '@rneui/themed';

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

const Filer = ({ index, title, option, isVisible, select, close, theme }) => {


    return <>
        <Text
            onPress={select.bind(this, index)}
            style={isVisible ? { color: theme.colors.primary } : undefined}
        >
            <Icon
                name={"edit"}
                type="antdesign" size={12}
                color={isVisible ? theme.colors.primary : '#555555'}
            /> {title}
        </Text>
        {
            isVisible &&
            <BottomSheet
                modalProps={{
                    onRequestClose: close,
                }}
                isVisible={isVisible}
                onBackdropPress={close}
            >
                <ListItem>
                    <Text>{JSON.stringify(option)}</Text><Text>{JSON.stringify(option)}</Text>
                </ListItem>
                <View style={{ flexDirection: 'row', }}>
                    <Button
                        title="取消"
                        buttonStyle={{
                            backgroundColor: 'rgba(244, 244, 244, 1)',
                        }}
                        containerStyle={{
                            flex: 1
                        }}
                        titleStyle={{ marginHorizontal: 20, color: 'black' }}
                        size='lg'
                        onPress={close}
                    />
                    <Button
                        title="Light"
                        containerStyle={{
                            flex: 1
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
    }
})
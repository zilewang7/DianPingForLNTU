import { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Icon, BottomSheet, ListItem, Text, Button } from "@rneui/themed"
import { hexToRgba } from "../../util/color";
import { clone } from 'lodash';

export const Filter = ({ index, title, option, filter, isVisible, select, close, set, theme }) => {
    const [selectList, setSelectList] = useState<string[]>(filter);

    const isAllSelect = selectList.length === option.length;

    const cancel = () => {
        setSelectList(filter);
        close();
    }

    const onSure = () => {
        if (JSON.stringify(clone(selectList).sort()) !== JSON.stringify(clone(filter).sort())) {
            set(selectList);
        }
        close();
    }


    return <>
        <Pressable
            onPress={select.bind(this, index)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
        >
            <Icon
                name="filter"
                type="antdesign" size={12}
                color={(isVisible || !isAllSelect) ? theme.colors.primary : '#555555'}
            />
            <Text
                style={{ color: (isVisible || !isAllSelect) ? theme.colors.primary : theme.colors.black }}
            >{title}</Text>
        </Pressable>
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
                    <View style={{ width: '100%' }}>
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
                <View style={{ flexDirection: 'row', backgroundColor: theme.colors.background }}>
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
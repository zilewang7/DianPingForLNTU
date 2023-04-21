import { BottomSheet, ListItem } from '@rneui/base';
import React, { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';


export function MyImageViewer({ visible, onCancel, images, index = 0 }) {
    const list = [
        {
            title: '保存图片',
            onPress: ({ saveToLocal }) => { saveToLocal() },
        },
        {
            title: '取消',
            containerStyle: { backgroundColor: '#eeeeee' },
            onPress: ({ cancel }) => { cancel() },
        },
    ];
    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onCancel}
            animationType={'fade'}
        >
            <ImageViewer
                imageUrls={images}
                index={index}
                onClick={() => { onCancel() }}
                menus={({ cancel, saveToLocal }) => (
                    <View style={{ flex: 1 }} >
                        <View style={{ flex: 1 }} />
                        {list.map((l, i) => (
                            <ListItem
                                key={i}
                                containerStyle={l.containerStyle}
                                onPress={l.onPress.bind(this, { cancel, saveToLocal })}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{l.title}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </View>

                )}
            />
        </Modal>
    );
}



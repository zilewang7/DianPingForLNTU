import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ListItem } from '@rneui/base';
import { Modal, View, Pressable, Vibration } from 'react-native';
import { saveImg } from '../../util/img';
import { Image } from 'expo-image';


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
                onSave={(imageUri) => saveImg(imageUri)}
                enableSwipeDown={true}
                onSwipeDown={() => { onCancel() }}
                onLongPress={() => { Vibration.vibrate(1) }}
                renderImage={({ ...props }) => <Image {...props} />}
                menus={({ cancel, saveToLocal }) => (
                    <View style={{ flex: 1 }} >
                        <Pressable onPress={cancel} style={{ flex: 1 }} />
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



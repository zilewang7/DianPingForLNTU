import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image'
import { MyImageViewer } from './imgVIewer';
import { ScreenWidth } from '@rneui/base';

export const ImageListViewer = ({ images }: { images: string[] }) => {
    const [viewerVisible, setViewerVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const renderImages = () => {
        return images.map((image, index) => (
            <Pressable
                key={index}
                style={styles.imageContainer}
                onPress={(() => {
                    setImageIndex(index);
                    setViewerVisible(true);
                })}
            >
                <Image source={{ uri: (image + '?x-oss-process=image/resize,h_200,m_lfit') }} style={styles.image} />
            </Pressable>
        ));
    };

    return (
        <>
            <View style={styles.imagesContainer}>
                {renderImages()}

            </View>
            {
                viewerVisible &&
                <MyImageViewer
                    visible={viewerVisible}
                    onCancel={setViewerVisible.bind(this, false)}
                    images={images.map(url => ({ url }))}
                    index={imageIndex}
                />
            }
        </>
    );
};

const styles = StyleSheet.create({
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        margin: 5,
    },
    image: {
        width: (ScreenWidth - 130) / 3,
        height: (ScreenWidth - 130) / 3,
    },
});

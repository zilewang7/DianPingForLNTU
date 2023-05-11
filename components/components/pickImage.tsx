import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image'
import { Icon, Text } from '@rneui/themed'
import { pickImage } from '../../util/img';
import { MyImageViewer } from './imgVIewer';

export const ImagePicker = ({ images, setImages }: { images: string[], setImages: React.Dispatch<React.SetStateAction<string[]>> }) => {
    const [viewerVisible, setViewerVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const scrollViewRef = useRef<any>();

    const selectImage = async () => {
        try {
            const uri = await pickImage();
            if (uri) {
                setImages([...images, uri]);
            }
            scrollViewRef.current?.scrollToEnd();
        } catch (err) {
            console.error(err);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

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
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                    <Icon name='closecircle' type='antdesign' color='red' size={20} />
                </TouchableOpacity>
                <View style={{ height: 20, marginTop: -20, backgroundColor: 'rgba(255,255,255, 0.5)', alignItems: 'center' }}>
                    <Text>{index + 1}</Text>
                </View>
            </Pressable>
        ));
    };

    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container} ref={scrollViewRef}>
                {renderImages()}
                {
                    images.length < 9 && <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderText}>选择图片</Text>
                        </View>
                    </TouchableOpacity>
                }
            </ScrollView>
            {
                viewerVisible &&
                <MyImageViewer
                    visible={viewerVisible}
                    onCancel={setViewerVisible.bind(this, false)}
                    images={images.map(url => ({ url }))}
                    index={imageIndex}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
    },
    imageContainer: {
        margin: 5,
    },
    image: {
        width: 100,
        height: 100,
    },
    removeButton: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    placeholderContainer: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: 'gray',
        fontSize: 16,
    },
});

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image'
import { Text } from '@rneui/themed'
import { pickImage } from '../util/img';
import { ScreenWidth } from '@rneui/base';

export const ImagePicker = ({ }) => {
    const [images, setImages] = useState([]);

    const selectImage = async () => {
        try {
            const uri = await pickImage();
            if (uri) {
                setImages([...images, uri]);
            }
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
            <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                    <Text style={styles.removeButtonText}>X</Text>
                </TouchableOpacity>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            {renderImages()}
            <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
                <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>选择图片</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: ScreenWidth * 0.9,
    },
    imageContainer: {
        margin: 5,
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 50,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
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

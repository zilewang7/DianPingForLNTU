import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { MyImageViewer } from '../components/components/imgVIewer';

function BusinessScreen({ navigation }) {
    const params: any = useRoute().params;

    const { address, name, pictureUrl, posts } = params.business;

    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: name,
        });
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <Pressable style={{ width: '100%', height: innerWidth / 4 * 3 }} onPress={setImageViewerVisible.bind(this, true)}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={pictureUrl}
                />
            </Pressable>
            <MyImageViewer
                visible={imageViewerVisible}
                onCancel={setImageViewerVisible.bind(this, false)}
                images={[{ url: pictureUrl }]}
            />
        </View>
    )
};

const styles = StyleSheet.create({

})

export default BusinessScreen;
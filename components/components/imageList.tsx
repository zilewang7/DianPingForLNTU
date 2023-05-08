import React, { useState } from 'react';
import { TabView, useTheme } from '@rneui/themed';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { MyImageViewer } from './imgVIewer';

export const ImageList = ({ index, setIndex, imageUrls, height }) => {
    const { theme } = useTheme();
    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    return (
        <>
            <TabView value={index} onChange={setIndex} animationType="spring">
                {imageUrls.map((url, index) => {
                    return (
                        <TabView.Item style={{ width: '100%' }} key={index}>
                            <Pressable
                                style={{ backgroundColor: theme.colors.grey5, width: '100%', height }}
                                onPress={() => { setImageViewerVisible(true) }}
                            >
                                <Image style={{ width: '100%', height: '100%', }} contentFit='contain' source={url} />
                            </Pressable>
                        </TabView.Item>
                    );
                })}
            </TabView>
            <MyImageViewer
                visible={imageViewerVisible}
                onCancel={setImageViewerVisible.bind(this, false)}
                images={imageUrls.map(url => ({ url }))}
                index={index}
            />
        </>

    );
};
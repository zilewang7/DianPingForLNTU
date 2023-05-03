import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Input, Text } from '@rneui/themed';
import StarRating from 'react-native-star-rating-widget';
import { useRoute } from '@react-navigation/native';
import { createPost } from '../api/post.api';
import { ImagePicker } from '../components/pickImage';

export function EditPostScreen({ navigation }) {
    const params: any = useRoute().params;

    const { address, rating = 0 } = params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [starRating, setStarRating] = useState<number>(rating);

    const commitPost = async () => {
        const newP = await createPost({
            businessAddress: address,
            rating: starRating,
            title,
            content,
        })
        console.log(newP);

    }

    return (
        <View>
            <Input
                value={title}
                placeholder='标题'
                onChangeText={setTitle}
            />
            <StarRating
                rating={starRating}
                onChange={rating => { setStarRating(rating < 0.5 ? 0.5 : rating) }}
                minRating={0.5}
            />
            <Input
                value={content}
                placeholder='内容'
                multiline={true}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                onChangeText={setContent}
            />
            <Button onPress={commitPost} title={'提交'} />
            <View style={{ alignItems: 'center' }}>
                <ImagePicker />
            </View>
        </View>
    )
}
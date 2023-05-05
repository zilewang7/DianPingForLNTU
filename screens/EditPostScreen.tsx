import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
import { Button, Dialog, Divider, Input, LinearProgress, Text } from '@rneui/themed';
import StarRating from 'react-native-star-rating-widget';
import { useRoute } from '@react-navigation/native';
import { createPost } from '../api/post.api';
import { ImagePicker } from '../components/pickImage';
import { uploadImg } from '../util/img';
import { useSelector } from '../redux/hook';

interface UpdatingState {
    visible: boolean;
    message: string;
    process: number;
}

export function EditPostScreen({ navigation }) {
    const params: any = useRoute().params;

    const currentBusiness = useSelector(state => state.business.currentBusiness);
    const { address, rating, placeText, refreshBusiness, backToBusiness } = params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [starRating, setStarRating] = useState<number | undefined>(rating);
    const [images, setImages] = useState<string[]>([]);
    const [updating, setUpdatingState] = useState<number>(0);

    const contentRef = useRef<any>();

    const updatingState: UpdatingState = useMemo(() => {
        switch (updating) {
            case 0:
                return {
                    visible: false,
                    message: '',
                    process: 0
                };
            case -1:
                return {
                    visible: true,
                    message: '提交失败',
                    process: 0
                }
            case Infinity:
                return {
                    visible: true,
                    message: '提交成功',
                    process: 1
                }
            case images.length + 1: {
                return {
                    visible: true,
                    message: '正在提交点评',
                    process: (updating + 0.9) / (images.length + 1)
                }
            }
            default:
                return {
                    visible: true,
                    message: `正在上传第(${updating}/${images.length})张图片`,
                    process: updating / (images.length + 1)
                }
        }
    }, [updating])

    useEffect(() => {
        navigation.setOptions({
            title: `${placeText}`,
        });
    }, []);

    const commitPost = async () => {
        const checkRating = (starRating === 0);
        const checkContent = (content === '');
        if (checkRating || checkContent) {
            Alert.alert('点评好像不完整呢', `还没有 ${checkRating ? '给这家店打分 ' : ''}${checkContent ? '填写点评内容 ' : ''}呢`)
            return;
        }
        setUpdatingState(1);

        let uploadedCount = 0;
        const uploadPromises: Promise<string>[] = [];
        images.forEach(async (image) => {
            uploadPromises.push(new Promise((resolve, reject) => {
                uploadImg(image, 'PostImage').then((value) => {
                    uploadedCount += 1;
                    setUpdatingState(uploadedCount);
                    resolve(value);
                }).catch(err => {
                    console.error(err)
                    reject(err)
                    setUpdatingState(-1);
                    return;
                })
            }));
        })

        const imageUrls = await Promise.all(uploadPromises);

        if (images.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setUpdatingState(images.length + 1);
        }

        const newPost = await createPost({
            businessAddress: address,
            rating: starRating,
            title,
            content,
            imageUrls,
        })

        if (newPost.ok) {
            refreshBusiness().then(() => {
                setUpdatingState(Infinity);
            })
        } else {
            setUpdatingState(-1);
        }
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <Input
                    value={title}
                    placeholder='标题（可不填）'
                    onChangeText={setTitle}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    containerStyle={{ marginBottom: -35, marginTop: 5 }}
                />
                <Divider style={{ marginVertical: 10 }} />
                <View style={{ alignItems: 'center' }}>
                    <Text h4>我的评分：{starRating ? starRating : '请打分'}</Text>
                    <StarRating
                        rating={starRating}
                        onChange={rating => { setStarRating(rating < 0.5 ? 0.5 : rating) }}
                        minRating={0.5}
                    />
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <Pressable style={{ flex: 1 }} onPress={() => {
                    contentRef.current.blur();
                    contentRef.current.focus();
                }}>
                    {
                        Platform.OS == "ios" ?
                            <>
                                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                                    <Input
                                        value={content}
                                        placeholder='内容（必填）'
                                        multiline={true}
                                        inputContainerStyle={{ borderBottomWidth: 0 }}
                                        onChangeText={setContent}
                                        ref={contentRef}
                                    />
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView behavior='padding' />
                            </>
                            :
                            <Input
                                value={content}
                                placeholder='内容（必填）'
                                multiline={true}
                                inputContainerStyle={{ borderBottomWidth: 0 }}
                                containerStyle={{ flex: 1 }}
                                onChangeText={setContent}
                                ref={contentRef}
                            />
                    }
                </Pressable>
                <Divider style={{ marginVertical: 10 }} />
                <ImagePicker images={images} setImages={setImages} />
                <Button onPress={commitPost} title={'提交'} />
            </View>
            <Dialog
                isVisible={updatingState.visible}
            >
                <Dialog.Title title={updatingState.message === '提交成功' ? '点评成功' : "上传中，请稍后"} />
                <LinearProgress
                    animation
                    style={{ marginVertical: 10 }}
                    value={updatingState.process}
                    variant="determinate"
                />
                <Text style={{ marginBottom: 10 }}>{updatingState.message}</Text>
                {
                    updatingState.message === '提交失败' && <Button onPress={() => setUpdatingState(0)} title='返回' />
                }
                {
                    updatingState.message === '提交成功' && <Button onPress={() => {
                        setUpdatingState(0);
                        backToBusiness(currentBusiness);
                    }} title='确定' />
                }
            </Dialog>
        </>
    )
}
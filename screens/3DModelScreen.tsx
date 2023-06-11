import { ButtonGroup, Divider, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ModalCard } from '../components/components/modalCard';
import { CanteenModel } from '../components/threeJS/CanteenModel';
import { useRoute } from '@react-navigation/native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { hexToRgba } from '../util/color';
import { useSelector } from '../redux/hook';


function ModelScreen({ setTabSwitchAllowed, navigation }) {
    const { theme } = useTheme();
    const { setCurrentBusiness } = useSelector(state => state.business.helper)

    const [selectedCanteen, setSelectedCanteen] = useState(0);
    const [selectedFloorsIndex, setSelectedFloors] = useState([0, 1, 2]);
    const [modalState, setModalState] = useState(false);
    const [reloadModel, setReload] = useState(false);

    const [onSelect, setOnSelect] = useState(false);
    const [businessNeedLocate, setBusinessNeedLocate] = useState(null);

    const selectedFloors = selectedFloorsIndex.map((index) => {
        if (index === 0) return '1'
        if (index === 1) return '1.5'
        if (index === 2) return '2'
    })

    const [selectedRestaurant, setSelectedRestaurant] = useState<any>({});

    const onSelectRestaurant = (info) => {
        setSelectedRestaurant(info);
        setModalState(true);
    }

    const FirstCanteenMolal = require('../assets/canteen/一食堂.glb');
    const SecondCanteenMolal = require('../assets/canteen/二食堂.glb');


    const params: any = useRoute().params;
    useEffect(() => {
        if (params?.address) {
            const place = params.address.split('-');
            setSelectedCanteen(place[0] - 1)
            setBusinessNeedLocate(params.address);
        }
    }, [params?.address])


    return (
        <View style={styles.canteenScreen}>
            <ButtonGroup
                buttons={['一食堂', '二食堂']}
                selectedIndex={selectedCanteen}
                onPress={(value) => {
                    setSelectedCanteen(value);
                    setSelectedFloors([0, 1, 2]);
                    setSelectedRestaurant(null);
                    setOnSelect(false)
                    setBusinessNeedLocate(null)
                    setReload(true);
                    setTimeout(() => {
                        setReload(false)
                    });
                }}
                containerStyle={styles.CanteenButtonContainer}
                buttonStyle={styles.buttonStyle}
            />
            <CanteenModel
                onSelectRestaurant={onSelectRestaurant}
                setTabSwitchAllowed={setTabSwitchAllowed}
                modalFile={selectedCanteen === 0 ? FirstCanteenMolal : SecondCanteenMolal}
                selectedFloors={selectedFloors}
                reloadModel={reloadModel}
                onSelect={onSelect}
                setOnSelect={setOnSelect}
                businessNeedLocate={businessNeedLocate}
            />
            <ButtonGroup
                buttons={['1楼', '1.5楼', '2楼']}
                selectMultiple
                selectedIndexes={selectedFloorsIndex}
                disabled={selectedCanteen === 0 ? [1] : []}
                onPress={(value) => {
                    setSelectedFloors(value);
                }}
                containerStyle={styles.FloorButtonContainer}
                buttonStyle={styles.buttonStyle}
            />
            <ModalCard
                visible={modalState}
                animationType="slide"
                onRequestClose={setModalState.bind(this, false)}
                transparent={true}
                touchOutOfCard={setModalState.bind(this, false)}
            >
                <View style={{ flexDirection: 'row' }}>
                    <Text h4>{selectedRestaurant?.name} </Text>
                    <Text
                        style={{
                            alignSelf: 'center',
                            paddingHorizontal: 4,
                            borderRadius: 5,
                            backgroundColor: hexToRgba(theme.colors.primary, '0.15'),
                            color: theme.colors.primary,
                            overflow: 'hidden',
                        }}
                    >
                        {selectedRestaurant?.type}
                    </Text>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                    <Text h4>评分：{(parseInt((selectedRestaurant?.rating * 10).toString()) / 10) || '暂无'}</Text>
                    <StarRatingDisplay rating={selectedRestaurant?.rating || 0} style={{ marginTop: 5 }} />
                </View>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {
                    const place = selectedRestaurant.address.split('-');
                    const placeText = `${place[0]} 食堂 ${place[1]} 楼`;
                    setCurrentBusiness(selectedRestaurant.address)
                    setTimeout(() => {
                        navigation.navigation.navigate("商家", { business: selectedRestaurant, placeText });
                    })
                }}>
                    <Text h4>进入店铺 &gt;</Text>
                </TouchableOpacity>
            </ModalCard>
        </View >
    )
};


const styles = StyleSheet.create({
    canteenScreen: {
        flex: 1
    },
    CanteenButtonContainer: {
        backgroundColor: '#ffffff00',
        zIndex: 100,
        marginBottom: -45,
    },
    FloorButtonContainer: {
        backgroundColor: '#ffffff00',
        width: '70%',
        marginHorizontal: '15%',
        marginTop: -70,
        marginBottom: 30,
    },
    buttonStyle: {
        backgroundColor: '#ffffff'
    },
})

export default ModelScreen;
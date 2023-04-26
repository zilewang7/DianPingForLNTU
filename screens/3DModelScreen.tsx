import { ButtonGroup } from '@rneui/themed';
import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { ModalCard } from '../components/components/modalCard';
import { CanteenModel } from '../components/threeJS/CanteenModel';


function ModelScreen({ setTabSwitchAllowed }) {
    const [selectedCanteen, setSelectedCanteen] = useState(0);
    const [selectedFloorsIndex, setSelectedFloors] = useState([0, 1, 2]);
    const [modalState, setModalState] = useState(false);
    const [reloadModel, setReload] = useState(false);

    const [onSelect, setOnSelect] = useState(false);

    const selectedFloors = selectedFloorsIndex.map((index) => {
        if (index === 0) return '1'
        if (index === 1) return '1.5'
        if (index === 2) return '2'
    })

    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const onSelectRestaurant = (name) => {
        setSelectedRestaurant(name);
        setModalState(true);
    }

    const FirstCanteenMolal = require('../assets/canteen/一食堂.glb');
    const SecondCanteenMolal = require('../assets/canteen/一食堂一楼.glb');

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
                <Text>{selectedRestaurant}</Text>
            </ModalCard>
        </View>
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
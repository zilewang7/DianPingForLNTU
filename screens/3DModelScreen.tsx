import { ButtonGroup } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { ModalCard } from '../components/modalCard';
import { MyDormitory } from '../components/threeJS/MyDormitory';


function ModelScreen() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedIndexes, setSelectedIndexes] = useState([0, 1, 2]);
    const [modalState, setModalState] = useState(false);

    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const onSelectRestaurant = (name) => {
        setSelectedRestaurant(name);
        setModalState(true);
    }

    return (
        <View style={styles.canteenScreen}>
            <ButtonGroup
                buttons={['一食堂', '二食堂']}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                }}
                containerStyle={styles.CanteenButtonContainer}
                buttonStyle={styles.buttonStyle}
            />
            {
                selectedIndex === 0
                    ? (
                        <MyDormitory onSelectRestaurant={onSelectRestaurant} />
                    )
                    : (
                        <MyDormitory onSelectRestaurant={onSelectRestaurant} />
                    )
            }
            <ButtonGroup
                buttons={['1楼', '1.5楼', '2楼']}
                selectMultiple
                selectedIndexes={selectedIndexes}
                disabled={selectedIndex === 0 ? [1] : []}
                onPress={(value) => {
                    setSelectedIndexes(value);
                }}
                containerStyle={styles.FloorButtonContainer}
                buttonStyle={styles.buttonStyle}
            />
            <ModalCard
                visible={modalState}
                animationType="slide"
                onRequestClose={setModalState.bind(this, false)}
                transparent={true} touchOutOfCard={setModalState.bind(this, false)}
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
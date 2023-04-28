import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BusinessList } from '../components/BusinessList';

function HomeScreen() {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.mainInnerContainer}>
                <Text>PlaceHolder</Text>
            </View>
            <View style={{ flex: 1 }}>
                <BusinessList />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    mainInnerContainer: {
        height: 150,
        backgroundColor: '#999999',
    }
})

export default HomeScreen;
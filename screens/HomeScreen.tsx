import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BusinessList } from '../components/BusinessList';

function HomeScreen() {
    return (
        <ScrollView>
            <View style={styles.mainInnerContainer}>
                <Text>PlaceHolder</Text>
            </View>
            <BusinessList />
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    mainInnerContainer: {
        height: 150,
        backgroundColor: '#999999',
    }
})

export default HomeScreen;
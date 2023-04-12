import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { ThemeComponent } from '../components/Theme';

function HomeScreen() {
    return (
        <View>
            <Text>HomeScreen</Text>
            <ThemeComponent />
        </View>
    )
};

const styles = StyleSheet.create({
    
})

export default HomeScreen;
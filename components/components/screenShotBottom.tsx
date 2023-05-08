import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'react-native'
import { Text, useTheme } from '@rneui/themed'
import { hexToRgba } from '../../util/color'

export function ScreenShotBottom({ ScreenHeight, content }) {
    const { theme } = useTheme();
    return (
        <View style={{
            height: ScreenHeight * 0.3,
            marginTop: - ScreenHeight * 0.3,
            zIndex: 1000,
        }}>
            <LinearGradient
                colors={[hexToRgba(theme.colors.background, '0'), hexToRgba(theme.colors.background, '1')]}
                style={{ height: ScreenHeight * 0.15, padding: 0, margin: 0 }}
            />
            <View style={{
                flex: 1,
                height: ScreenHeight * 0.15 + 1,
                marginTop: -1,
                backgroundColor: theme.colors.background,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
            }}>
                <View>
                    <Text h3>工大点评</Text>
                    <Text style={{ margin: 5 }}>{content}</Text>
                </View>
                <View>
                    <Text>我是二维码</Text>
                </View>
            </View>
        </View>
    )
}

import { useTheme } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

export const ModalCard = ({ children, touchOutOfCard, ...props }) => {
    const { theme } = useTheme();

    return (
        <Modal {...props}>
            <TouchableWithoutFeedback onPress={touchOutOfCard}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={styles.centeredView}>
                    <TouchableWithoutFeedback>
                        <View style={{...styles.modalView, backgroundColor: theme.colors.background }}>
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

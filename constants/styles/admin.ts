import { StyleSheet } from 'react-native';
import Colors from "../Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: Colors.textTitle,
    },
    input: {
        height: 40,
        borderColor: Colors.gray,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: Colors.textPrimary,
    },
    button: {
        backgroundColor: Colors.buttonPrimary.background,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.buttonPrimary.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
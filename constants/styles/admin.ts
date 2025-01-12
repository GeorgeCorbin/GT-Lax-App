import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const adminStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
        fontFamily: 'roboto-regular',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'roboto-regular-bold',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'roboto-regular-bold',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: Colors.buttonSecondary.background,
        color: Colors.inputText,
        fontFamily: 'roboto-regular',
    },
    button: {
        backgroundColor: Colors.buttonPrimary.background,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: Colors.buttonPrimary.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'roboto-regular-bold',
    },
    error: {
        color: Colors.errorText,
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'roboto-regular',
    },
    link: {
        color: Colors.link,
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'roboto-regular',
    },
    panelHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 10,
        fontFamily: 'roboto-regular-bold',
    },
    panelButton: {
        backgroundColor: Colors.buttonPrimary.background,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    panelButtonText: {
        color: Colors.buttonPrimary.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'roboto-regular-bold',
    },
});

export default adminStyles;
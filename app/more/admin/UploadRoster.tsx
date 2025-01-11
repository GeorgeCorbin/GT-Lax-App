import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/firebaseConfig';
import Colors from '@/constants/Colors';

const UploadRoster = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileUri, setFileUri] = useState('');
    const [progress, setProgress] = useState(0);

    const handleSelectFile = async () => {
        try {
            // Simulate file picking by browsing files in the app's directory
            const fileUri = `${FileSystem.documentDirectory}example.csv`;

            // Ensure the file exists before proceeding
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
                Alert.alert('File Not Found', 'The selected file does not exist.');
                return;
            }

            setFileName(fileUri.split('/').pop()!);
            setFileUri(fileUri);
            Alert.alert('File Selected', `File: ${fileName}`);
        } catch (error) {
            console.error('Error selecting file:', error);
            Alert.alert('Error', 'An error occurred while selecting the file.');
        }
    };

    const handleUpload = async () => {
        if (!fileUri || !fileName) {
            Alert.alert('No File Selected', 'Please select a file before uploading.');
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const fileRef = ref(storage, 'players/theroster.csv'); // Rename file to "theroster.csv"
            const response = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });

            // Convert the string content to a Blob
            const blob = new Blob([response], { type: 'text/csv' });

            const uploadTask = uploadBytesResumable(fileRef, blob);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    Alert.alert('Error', 'Failed to upload the file.');
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    Alert.alert('Success', 'Roster uploaded successfully!');
                    console.log('File available at:', downloadURL);
                    setFileName('');
                    setFileUri('');
                }
            );
        } catch (error) {
            console.error('Error uploading file:', error);
            Alert.alert('Error', 'An error occurred during the upload.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload Roster</Text>
            <Text style={styles.description}>
                Select a roster file from your device and upload it to Firebase Storage.
            </Text>

            {fileName ? (
                <Text style={styles.fileName}>Selected File: {fileName}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSelectFile} disabled={isUploading}>
                <Text style={styles.buttonText}>Select File</Text>
            </TouchableOpacity>

            {fileUri && !isUploading && (
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.buttonText}>Upload File</Text>
                </TouchableOpacity>
            )}

            {isUploading && (
                <>
                    <ActivityIndicator size="large" color={Colors.techGold} />
                    <Text style={styles.progress}>
                        {`Uploading... ${progress.toFixed(0)}%`}
                    </Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.techGold,
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.grayMatter,
        marginBottom: 20,
        textAlign: 'center',
    },
    fileName: {
        fontSize: 16,
        color: Colors.techGold,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: Colors.techGold,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    uploadButton: {
        backgroundColor: Colors.techGold,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    progress: {
        fontSize: 16,
        color: Colors.techGold,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default UploadRoster;

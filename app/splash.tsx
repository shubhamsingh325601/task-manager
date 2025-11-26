import { navigate } from 'expo-router/build/global-state/routing';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function splash() {
    useEffect(() => {
       setTimeout(async () => navigate("/todo"), 3000)
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Task Manager</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignContent: "center" },
    title: { textAlign: "center", fontSize: 28 }
});

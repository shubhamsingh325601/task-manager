import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';


export default function ToDoScreen() {
    const [tasks, setTasks] = useState<any>([]);

    useEffect(() => {
        getTask();
    }, [])

    const getTask = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem("tasks");
            const tasks = storedTasks ? JSON.parse(storedTasks) : [];

            setTasks(tasks);
            console.log("Loaded tasks:", tasks);
        } catch (error) {
            console.error("Error getting tasks:", error);
        }
    };

    const navigationHandler = async () => {
        await AsyncStorage.setItem("updateTask", "")
        await navigate("/addTask")
    }

    const goToListing = async () => {
        await navigate("/listingScreen")
    }

    const removeHandler = async (item: any) => {
        try {
            const updatedTasks = tasks.filter(
                (task: any) => task.title !== item.item.title || task.description !== item.item.description
            );

            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            Alert.alert("Item successfully removed.")
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error removing task:", error);
        }
    };


    const updateHandler = async (item: any) => {
        try {
            await AsyncStorage.setItem("updateTask", JSON.stringify(item.item));
            navigate("/addTask");
        } catch (error) {
            console.error("Error preparing task for update:", error);
        }
    };


    const renderItem = (item: any) => {
        return (
            <View style={styles.renderItemsContainer}>
                <View style={styles.textContainer}>
                    <View >
                        <Text style={[styles.task, styles.textBold]}>Title:</Text>
                        <Text style={styles.task}>
                            {item?.item?.title}
                        </Text>
                    </View>
                    <View >
                        <Text style={[styles.task, styles.textBold]}>Description:</Text>
                        <Text style={styles.task}>
                            {item?.item?.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.renderItemButtons}>
                    <Pressable
                        onPress={() => removeHandler(item)}
                        style={[styles.removeButton, styles.button]}>
                        <Text
                            style={styles.buttonText}>
                            Remove
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => updateHandler(item)}
                        style={[styles.buttons, styles.button]}>
                        <Text
                            style={[{ borderColor: "green" }, styles.buttonText]}>
                            Update
                        </Text>
                    </Pressable>
                </View>
            </View>)
    }

    return (
        <View style={styles.container}>
            <View style={styles.taskContainer}>
                {
                    tasks &&
                    <FlatList
                        data={tasks}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={renderItem} />
                }
            </View>

            <View style={styles.buttonContainer}>
                <Pressable
                    onPress={goToListing}
                    style={[styles.buttons, styles.button]}>

                    <Text
                        style={styles.buttonText}>
                        Go to Listing
                    </Text>
                </Pressable>

                <Pressable
                    onPress={navigationHandler}
                    style={[styles.addButton]}>
                    <Text
                        style={styles.addText}>
                        +
                    </Text>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    buttonContainer: { paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between", bottom: 50,},
    renderItemButtons: { justifyContent: "center" },
    buttonText: { textAlign: 'right', fontSize: 20, paddingHorizontal: 20 },
    button: { height: 45, justifyContent: "center", alignContent: "center", },
    addText: { textAlign: 'right',alignSelf:"center",textAlignVertical:"center", fontSize: 30, paddingHorizontal: 20, marginBottom: 10 },
    taskContainer: { flex: 1, justifyContent: 'flex-start', paddingVertical: 75 },
    task: { fontSize: 20 },
    textBold: { fontWeight: "800", paddingRight: 5 },
    removeButton: { borderWidth: 1, marginBottom: 5, borderRadius: 5, borderColor: "red" },
    buttons: { borderWidth: 1, borderRadius: 5, borderColor: "green" },
    textContainer: { width: "70%", },
    addButton:{ height: 45, justifyContent: "center", },
    renderItemsContainer: { borderWidth: 1, paddingHorizontal: 10, borderRadius: 5, flexDirection: "row", borderColor: "#333", marginHorizontal: 10, paddingVertical: 5, marginBottom: 5 }
});

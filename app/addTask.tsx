import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from 'expo-router/build/global-state/routing';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


export default function ToDoScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    useEffect(() => {
        const loadUpdateTask = async () => {
            const storedTask = await AsyncStorage.getItem("updateTask");
            if (storedTask) {
                const task = JSON.parse(storedTask);
                setTitle(task.title);
                setDescription(task.description);
            }
        };

        loadUpdateTask();
    }, []);

    const addTask = async () => {
        if (title.trim() === "") {
            setTitleError("This field is required.");
            return;
        }

        if (description.trim() === "") {
            setDescriptionError("This field is required.");
            return;
        }

        try {
            const existingTasks = await AsyncStorage.getItem("tasks");
            const tasks = existingTasks ? JSON.parse(existingTasks) : [];

            const storedUpdateTask = await AsyncStorage.getItem("updateTask");

            let updatedTasks;

            if (storedUpdateTask) {
                const updateTask = JSON.parse(storedUpdateTask);

                updatedTasks = tasks.map((t: any) =>
                    t.title === updateTask.title && t.description === updateTask.description
                        ? { ...t, title, description }
                        : t
                );

                await AsyncStorage.removeItem("updateTask");
            } else {
                const newTask = { title, description };
                updatedTasks = [...tasks, newTask];
            }

            await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
            navigate("/todo");
        } catch (error) {
            console.error("Error adding or updating task:", error);
        }
    };

    const titleHandler = (text: string) => {
        setTitle(text);
        setTitleError("");
    }

    const descriptionHandler = (text: string) => {
        setDescription(text);
        setDescriptionError("");
    }

    return (
        <View style={styles.container}>
            <View style={styles.fieldsContiner}>
                <Text >Title</Text>
                <TextInput
                    defaultValue={title}
                    value={title}
                    onChangeText={titleHandler}
                    style={styles.textField} />
                {titleError && <Text style={styles.errorMessage}>{titleError}</Text>}
            </View>

            <View style={styles.fieldsContiner}>
                <Text>Description</Text>
                <TextInput
                    defaultValue={description}
                    value={description}
                    onChangeText={descriptionHandler}
                    style={styles.textField} />
                {descriptionError && <Text style={styles.errorMessage}>{descriptionError}</Text>}
            </View>

            <Pressable onPress={addTask} style={styles.button}>
                <Text style={{ color: "white" }}>Submit</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignContent: "center", justifyContent: "center" },
    textField: { height: 55, borderWidth: 2, borderColor: "#e0e0e0", borderRadius: 5 },
    errorMessage: {
        color: "#ff0000"
    },
    fieldsContiner: { marginVertical: 5, marginHorizontal: 10 },
    button: { alignItems: "center", backgroundColor: "red", borderRadius: 5, marginTop: 10, width: "50%", alignSelf: "center", paddingVertical: 10 }
});

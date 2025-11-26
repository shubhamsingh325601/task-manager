import { getListing } from '@/services/listing';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';


export default function ListingScreen() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getListings();
    }, [])

    const getListings = async () => {
        try {
            const data = await getListing();
            setData(data);
        } catch (e) {
            console.error(e);
            setError("something went wrong")
        } finally {
            setLoading(false);
        }
    }

    const renderItems = (item: any) => {
        return (
            <View style={styles.itemContainer}>
                {/* <Text style={styles.text}> {item.item.city}</Text> */}
                {/* <Text style={styles.text}> {item.item.phone}</Text> */}
                <Text style={styles.text}>Name: {item.item.name}</Text>
                <Text style={styles.text}>Email : {item.item.email}</Text>
                {/* <Text style={styles.text}>{item.item.username}</Text> */}
            </View>)
    }

    return (
        <View style={styles.container}>
            {loading ?
                <ActivityIndicator size={25} color={"red"} />
                : data ? <View >
                    <FlatList
                        data={data}
                        keyExtractor={(item: any) => item?.id?.toString()}
                        renderItem={renderItems}
                    />
                </View>
                    : <Text style={styles.text}>No Data Found</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1,padding: "5%" },
    text: { textAlign: "center", fontSize: 18 },
    itemContainer: { borderWidth: 1, marginBottom: 10, borderRadius: 5 }
});

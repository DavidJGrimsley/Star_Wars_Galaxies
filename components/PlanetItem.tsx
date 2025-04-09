import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS } from '@/constants/colors';
import { Link } from 'expo-router';
import { Planet } from '@/types/interfaces';

const PlanetItem: React.FC<{ item: Planet }> = ({ item }) => {
    if (!item.url) {
        console.error('Invalid URL for planet:', item);
        return null; // Prevent rendering if URL is invalid
    }
    const id = item.url.split('/').filter(Boolean).pop() || ''; // Extract numeric ID from URL
    return (
        <Link href={`../planets/${id}`} asChild>
            <TouchableOpacity style={styles.item}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.head}>Climate: {item.climate}</Text>
                <Text style={styles.head}>Population: {item.population}</Text>
            </TouchableOpacity>
        </Link>
    );
};

export default PlanetItem;

const styles = StyleSheet.create({
    item: {
        backgroundColor: COLORS.itemBackground,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 32,
    },
    head: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});

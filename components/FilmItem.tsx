import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS } from '@/constants/colors';
import { Link } from 'expo-router';
import { Film } from '@/types/interfaces';

const toRoman = (num: number): string => {
    const romanMap: { [key: number]: string } = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX',
        10: 'X',
    };
    return romanMap[num] || num.toString(); // Fallback to the number if not in the map
};

const FilmItem: React.FC<{ item: Film }> = ({ item }) => {
    const id = item.url.split('/').filter(Boolean).pop() || ''; // Extract numeric ID from URL
    return (
        <Link href={`/films/${id}`} asChild>
            <TouchableOpacity style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.head}>Episode {toRoman(item.episode_id)}</Text>
            </TouchableOpacity>
        </Link>
    );
};

export default FilmItem;

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
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS } from '@/constants/colors';
import { Link } from 'expo-router';
import { Character } from '@/types/interfaces';

const toRoman = (num: number): string => {
    const romanMap: { [key: number]: string } = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
        5: "V",
        6: "VI",
        7: "VII",
        8: "VIII",
        9: "IX",
        10: "X",
    };
    return romanMap[num] || num.toString(); // Fallback to the number if not in the map
};

const CharacterItem: React.FC<{ character: Character }> = ({ character }) => {
    if (!character.url) {
        console.error('Invalid URL for character:', character);
        return null; // Prevent rendering if URL is invalid
    }
    const id = character.url.split('/').filter(Boolean).pop() || ''; // Extract numeric ID from URL
    return (
        <Link href={`/people/${id}`} asChild>
            <TouchableOpacity style={styles.item}>
                <View>
                    <Text style={styles.title}>{character.name}</Text>
                    <Text style={styles.head}>Birth Year: {character.birth_year}</Text>
                    <Text style={styles.head}>Gender: {character.gender}</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default CharacterItem;

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
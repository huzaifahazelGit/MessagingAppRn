import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface CustomTabsProps {
    routes: { key: string; title: string }[];
    index: number;
    setIndex: (index: number) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ routes, index, setIndex }) => {
    return (
        <View style={styles.tabContainer}>
            {routes.map((route, i) => (
                <TouchableOpacity
                    key={route.key}
                    style={[styles.tab, index === i && styles.activeTab]}
                    onPress={() => setIndex(i)}
                >
                    <Text style={[styles.tabText, index === i && styles.activeTabText]}>
                        {route.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tab: {
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        color: "#000",
    },
    activeTabText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});
export default CustomTabs;

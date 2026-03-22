import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

export default function MyPlantsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Benim Bitkilerim</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
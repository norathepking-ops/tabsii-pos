import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import Chip from '../common/Chip';

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export default function CategoryChips({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((cat) => (
        <Chip key={cat} label={cat} active={selected === cat} onPress={() => onSelect(cat)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.sm, gap: Spacing.xs },
});

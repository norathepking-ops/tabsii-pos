import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import CategoryChips from '../../components/menu/CategoryChips';
import MenuItemRow from '../../components/menu/MenuItemRow';
import CartBar from '../../components/menu/CartBar';
import { useMenuItems } from '../../hooks/useMenuItems';
import { useMenuStore, useOrderStore } from '../../store';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { ServerStackParamList } from '../../types';

type Nav = StackNavigationProp<ServerStackParamList, 'Menu'>;
type Route = RouteProp<ServerStackParamList, 'Menu'>;

export default function MenuScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { tableId, tableNumber } = params;

  useMenuItems();
  const { items, categories, selectedCategory, setSelectedCategory } = useMenuStore();
  const { cart, addToCart, updateCartQty, getCartCount, getCartTotal } = useOrderStore();

  const filtered = items.filter(
    (i) => i.active && (selectedCategory === 'ทั้งหมด' || i.category === selectedCategory)
  );

  function getQty(menuItemId: string) {
    return cart.find((c) => c.menuItem.id === menuItemId)?.qty ?? 0;
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.tableLabel}>โต๊ะ {tableNumber || '–'}</Text>
          <Text style={styles.tableSub}>เลือกรายการ</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <View style={{ flex: 1 }}>
        <FlashList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item, index }) => (
            <MenuItemRow
              item={item}
              index={index}
              qty={getQty(item.id)}
              onAdd={() => addToCart(item)}
              onInc={() => updateCartQty(item.id, getQty(item.id) + 1)}
              onDec={() => updateCartQty(item.id, getQty(item.id) - 1)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={<Text style={styles.empty}>ไม่มีเมนูในหมวดนี้</Text>}
        />
        <CartBar
          count={getCartCount()}
          total={getCartTotal()}
          onPress={() => nav.navigate('Cart', { tableId, tableNumber })}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.paper3,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.paper2, justifyContent: 'center', alignItems: 'center',
  },
  backText: { fontSize: 24, color: Colors.ink2, lineHeight: 30 },
  tableLabel: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink, textAlign: 'center' },
  tableSub: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3, textAlign: 'center' },
  sep: { height: 1, backgroundColor: Colors.paper3, marginHorizontal: Spacing.screenPad },
  empty: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink4, textAlign: 'center', marginTop: Spacing.xxl },
});

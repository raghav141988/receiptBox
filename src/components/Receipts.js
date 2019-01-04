import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ReceiptItem from "./ReceiptItem";

const receipts = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.receipts}
      renderItem={(info) => (
        <ReceiptItem
          receiptTitle={info.item.receiptTitle}
          receiptImage={info.item.image}
          onItemPressed={() => props.onItemSelected(info.item.key)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default receipts;

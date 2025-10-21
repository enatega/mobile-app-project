import { GradientBackground } from "@/src/components/common";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Title from "../../auth/components/common/TitleHeader";
import TransactionFilterTabs, {
    FilterType,
} from "../components/wallet-main/TransactionFilterTabs";
import TransactionsList from "../components/wallet-main/TransactionList";
import WalletBalanceCard from "../components/wallet-main/WalletBalanceCard";


const DUMMY_TRANSACTIONS = [
  {
    id: "1",
    type: "top-up",
    title: "Wallet Top up",
    date: "Oct 5. 4:12 PM",
    amount: 120.0,
    isPositive: true,
    icon: "💳",
  },
  {
    id: "2",
    type: "ride",
    title: "Ride",
    date: "Oct 5. 4:12 PM",
    amount: 48.75,
    isPositive: false,
    icon: "🚗",
  },
  {
    id: "3",
    type: "women-ride",
    title: "Women ride",
    date: "Oct 1. 1:42 AM",
    amount: 62.4,
    isPositive: false,
    icon: "🚙",
  },
  {
    id: "4",
    type: "ride",
    title: "Ride",
    date: "Sep 24. 8:19 PM",
    amount: 53.2,
    isPositive: false,
    icon: "🚗",
  },
  {
    id: "5",
    type: "top-up",
    title: "Wallet Top up",
    date: "Oct 5. 4:12 PM",
    amount: 120.0,
    isPositive: true,
    icon: "💳",
  },
];

const WalletMain = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredTransactions = DUMMY_TRANSACTIONS.filter((transaction) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "money-in") return transaction.isPositive;
    if (activeFilter === "money-out") return !transaction.isPositive;
    return true;
  });

  const handleAddFunds = () => {
    router.push("/(tabs)/(wallet)/addFund");
  };

  const handleTransactionPress = (transaction: any) => {
    console.log("Transaction pressed:", transaction);
    // Navigate to transaction detail screen if needed
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Fixed Header Section */}
        <View style={styles.fixedHeader}>
          {/* Top-left back button */}
          <View style={styles.backButtonWrapper}>
          </View>

          {/* Title Section */}
          <View style={styles.titleWrapper}>
            <Title
              heading="Wallet"
              subheading="View and manage your balance and transactions."
              containerStyle={styles.titleContainer}
            />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Balance Card */}
          <WalletBalanceCard balance={52.49} onAddFunds={handleAddFunds} />

          {/* Transactions Section */}
          <View style={styles.transactionsSection}>
            <Text style={styles.transactionsTitle}>Transactions</Text>

            {/* Filter Tabs */}
            <TransactionFilterTabs
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Transaction List */}
            <TransactionsList
              transactions={filteredTransactions}
              onTransactionPress={handleTransactionPress}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fixedHeader: {
    paddingTop: 10,
  },
  backButtonWrapper: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  titleWrapper: {
    marginBottom: 10,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  transactionsSection: {
    paddingHorizontal: 20,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
});

export default WalletMain;
import { GradientBackground } from "@/src/components/common";
import BackButton from "@/src/components/common/BackButton";
import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Title from "../../auth/components/common/TitleHeader";
import AddCardModal from "../components/addFund/AddCardModal";
import AddFundButton from "../components/addFund/AddFundButton";
import AmountInput from "../components/addFund/AmountInput";
import AmountOptionsList, {
    AmountOption,
} from "../components/addFund/AmountOptionsList";
import PaymentMethodModal from "../components/addFund/PaymentMethodModal";
import SelectedPaymentCard, { PaymentCard } from "../components/addFund/SelectedPaymentCard";

const AMOUNT_OPTIONS: AmountOption[] = [
  { id: "1", value: 10.0, label: "QAR 10.00" },
  { id: "2", value: 20.0, label: "QAR 20.00" },
  { id: "3", value: 40.0, label: "QAR 40.00" },
  { id: "4", value: 50.0, label: "QAR 50.00" },
];

const DUMMY_CARDS: PaymentCard[] = [
  { id: "1", type: "mastercard", lastFour: "1412", selected: true },
  { id: "2", type: "visa", lastFour: "9432", selected: false },
];

const AddFundMain = () => {
  const [amount, setAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(DUMMY_CARDS[0]);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  const handleAmountSelect = (value: number) => {
    setAmount(value.toFixed(2));
    Keyboard.dismiss();
  };

  const handleSelectCard = (card: PaymentCard) => {
    setSelectedCard(card);
    setShowPaymentModal(false);
  };

  const handleAddPaymentMethod = () => {
    setShowPaymentModal(false);
    setShowAddCardModal(true);
  };

  const handleSaveCard = () => {
    setShowAddCardModal(false);
    setCardNumber("");
    setExpiryDate("");
    setSecurityCode("");
  };

  const handleAddFunds = () => {
    console.log("Adding funds:", amount);
    // Handle add funds logic here
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Fixed Header Section */}
              <View style={styles.fixedHeader}>
                <View style={styles.backButtonWrapper}>
                  <BackButton
                    size={48}
                    iconSize={20}
                    borderColor="#D1D5DB"
                    iconColor="#000000"
                    backgroundColor="rgba(255,255,255,0.1)"
                  />
                </View>

                <View style={styles.titleWrapper}>
                  <Title
                    heading="Add funds"
                    subheading="Add a credit or debit card to quickly complete purchases."
                    containerStyle={styles.titleContainer}
                  />
                </View>
              </View>

              {/* Content Section */}
              <View style={styles.content}>
                {/* Amount Input Section */}
                <AmountInput amount={amount} onAmountChange={setAmount} />

                {/* Amount Options */}
                <AmountOptionsList
                  options={AMOUNT_OPTIONS}
                  onSelectAmount={handleAmountSelect}
                />
              </View>

              {/* Bottom Section */}
              <View style={styles.bottomSection}>
                {/* Selected Payment Card */}
                <SelectedPaymentCard
                  card={selectedCard}
                  onPress={() => setShowPaymentModal(true)}
                />

                {/* Add Funds Button */}
                <AddFundButton
                  onPress={handleAddFunds}
                  disabled={!amount || parseFloat(amount) < 10}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        visible={showPaymentModal}
        cards={DUMMY_CARDS}
        selectedCardId={selectedCard.id}
        onClose={() => setShowPaymentModal(false)}
        onSelectCard={handleSelectCard}
        onAddPaymentMethod={handleAddPaymentMethod}
      />

      {/* Add Card Modal */}
      <AddCardModal
        visible={showAddCardModal}
        cardNumber={cardNumber}
        expiryDate={expiryDate}
        securityCode={securityCode}
        onClose={() => setShowAddCardModal(false)}
        onCardNumberChange={setCardNumber}
        onExpiryDateChange={setExpiryDate}
        onSecurityCodeChange={setSecurityCode}
        onSave={handleSaveCard}
      />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
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
    content: {
      // Remove flex: 1 from here
      paddingHorizontal: 20,
      paddingTop: 32,
    },
    bottomSection: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 32,
      marginTop: 'auto', // This pushes it to the bottom
    },
  });

export default AddFundMain;
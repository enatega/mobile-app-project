import { Colors } from '@/src/constants'
import React, { useState } from 'react'
import { Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const { height } = Dimensions.get("window")

interface RatingModalProps {
    visible: boolean
    onClose: () => void
    onSubmit: (data: { rating: number; comment: string }) => void
}

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    {/* Heading */}
                    <Text style={styles.title}>You have arrived</Text>

                    {/* Profile Image */}
                    <Image
                        source={{ uri: "https://i.pravatar.cc/150" }} // Replace with passenger image
                        style={styles.profileImage}
                    />

                    {/* Stars */}
                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Text style={styles.star}>{star <= rating ? "⭐" : "☆"}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Comment Box */}
                    <TextInput
                        style={styles.commentBox}
                        placeholder="Leave a comment..."
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: Colors.light.success }]}
                        onPress={() => {
                            onSubmit({ rating, comment })
                            onClose()
                        }}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default RatingModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalCard: {
        height: height * 0.5, // Half screen height
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 20,
    },
    starRow: {
        flexDirection: "row",
        marginBottom: 20,
    },
    star: {
        fontSize: 35,
        marginHorizontal: 5,
    },
    commentBox: {
        width: "100%",
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: "top",
    },
    button: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
})

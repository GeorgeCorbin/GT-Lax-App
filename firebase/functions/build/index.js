/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Expo } from "expo-server-sdk";
admin.initializeApp();
const db = admin.firestore();
export const sendPushNotification = functions
    .https.onRequest(async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            res.status(400).send("Title and body are required.");
            return;
        }
        // Fetch all tokens from Firestore
        const tokensSnapshot = await db.collection("expoTokens").get();
        const tokens = [];
        tokensSnapshot.forEach((doc) => {
            tokens.push(doc.id);
        });
        if (tokens.length === 0) {
            res.status(200).send("No tokens found.");
            return;
        }
        // Validate and prepare notifications
        const expo = new Expo();
        const messages = tokens
            .filter((token) => Expo.isExpoPushToken(token)) // Validate Expo push tokens
            .map((token) => ({
            to: token,
            title,
            body,
            sound: "default",
            data: {
                screen: "Schedule", // The screen to navigate to
            }, // Optional: Add extra data
        }));
        // Chunk and send notifications
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            }
            catch (error) {
                console.error("Error sending notification chunk:", error);
            }
        }
        res.status(200).send("Notifications sent successfully.");
    }
    catch (error) {
        console.error("Error sending notifications:", error);
        res.status(500).send("Failed to send notifications.");
    }
});
//# sourceMappingURL=index.js.map
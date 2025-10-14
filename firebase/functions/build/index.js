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
import axios from "axios";
admin.initializeApp();
const db = admin.firestore();
// API key for securing notification endpoints
// Stored in Firebase environment config using 
// firebase functions:config:set api_key.value="your-secure-api-key"
const API_KEY = functions.config().api_key?.value;
// Function to validate API key from request
const validateApiKey = (req) => {
    // Check for API key in header (preferred method)
    const headerApiKey = req.get("X-API-Key");
    if (headerApiKey === API_KEY) {
        return true;
    }
    // Fallback: Check for API key in request body
    const bodyApiKey = req.body?.apiKey;
    if (bodyApiKey === API_KEY) {
        return true;
    }
    // No valid API key found
    return false;
};
// Notification options for new articles
const NOTIFICATION_TITLES = [
    "🏆 Georgia Tech Lacrosse News!",
    "🥍 Breaking: New GT Lax Update!",
    "⚡ Fresh GT Lacrosse Content!",
    "🔥 Georgia Tech Lax Alert!",
    "📰 Latest from the Yellow Jackets!",
    "🎯 GT Lacrosse Update!",
    "⭐ Georgia Tech News Flash!",
    "🚨 New Buzz from Tech Lacrosse!",
    "📢 Yellow Jacket Headlines!",
    "💪 Fresh GT Lax News!",
];
// Variable to track the last used notification title index
let lastUsedTitleIndex = -1;
// Function to fetch feature flags from Firebase hosting
const fetchFeatureFlags = async () => {
    try {
        const response = await axios.get("https://gt-lax-app.web.app/feature_flags.json");
        return response.data;
    }
    catch (error) {
        console.error("Error fetching feature flags:", error);
        return null;
    }
};
export const sendPushNotification = functions
    .https.onRequest(async (req, res) => {
    try {
        // Validate API key
        if (!validateApiKey(req)) {
            console.log("Unauthorized push notification request - invalid API key");
            res.status(401).send("Unauthorized - Invalid API key");
            return;
        }
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
export const sendArticleNotification = functions
    .https.onRequest(async (req, res) => {
    try {
        // Validate API key
        if (!validateApiKey(req)) {
            console.log("Unauthorized article notification request - invalid API key");
            res.status(401).send("Unauthorized - Invalid API key");
            return;
        }
        // Log the incoming request for debugging
        console.log("Received article notification request:", JSON.stringify(req.body));
        const { newArticlesCount, articleTitles } = req.body;
        // Only send notification if there are new articles
        if (!newArticlesCount || newArticlesCount <= 0) {
            console.log("No new articles to notify about.");
            res.status(200).send("No new articles to notify about.");
            return;
        }
        // Fetch feature flags
        const featureFlags = await fetchFeatureFlags();
        if (!featureFlags || !featureFlags.automatic_article_notifications) {
            console.log("Feature flags not available or automatic_article_notifications not configured.");
            res.status(200).send("Feature flags not available or " +
                "automatic_article_notifications not configured.");
            return;
        }
        const notificationFeature = featureFlags.automatic_article_notifications;
        // Check if the feature is enabled
        if (!notificationFeature.enabled) {
            console.log("Automatic article notifications feature is disabled");
            res.status(200).send("Automatic article notifications disabled.");
            return;
        }
        // Get random notification title (ensuring different from last used)
        let randomTitleIndex;
        do {
            randomTitleIndex = Math.floor(Math.random() *
                NOTIFICATION_TITLES.length);
        } while (randomTitleIndex === lastUsedTitleIndex &&
            NOTIFICATION_TITLES.length > 1);
        lastUsedTitleIndex = randomTitleIndex;
        const notificationTitle = NOTIFICATION_TITLES[randomTitleIndex];
        // Create notification body using article titles
        let notificationBody = "";
        if (articleTitles && Array.isArray(articleTitles) && articleTitles.length > 0) {
            if (newArticlesCount === 1) {
                notificationBody = `New article: "${articleTitles[0]}"`;
            }
            else if (newArticlesCount === 2) {
                notificationBody = `New articles: "${articleTitles[0]}" and ` +
                    `"${articleTitles[1]}"`;
            }
            else {
                // For 3+ articles, show first two and indicate there are more
                const remaining = newArticlesCount - 2;
                notificationBody = `New articles: "${articleTitles[0]}", ` +
                    `"${articleTitles[1]}" and ${remaining} more`;
            }
        }
        else {
            // Fallback to generic message if no titles provided
            notificationBody = newArticlesCount === 1 ?
                "Check out the latest news from the Yellow Jackets!" :
                `Check out ${newArticlesCount} new articles from ` +
                    "the Yellow Jackets!";
        }
        console.log(`Sending article notification: ${notificationTitle} - ` +
            `${notificationBody}`);
        // Fetch all tokens from Firestore
        const tokensSnapshot = await db.collection("expoTokens").get();
        let tokens = [];
        tokensSnapshot.forEach((doc) => {
            tokens.push(doc.id);
        });
        console.log(`Found ${tokens.length} total tokens in Firestore`);
        if (tokens.length === 0) {
            console.log("No tokens found in Firestore.");
            res.status(200).send("No tokens found.");
            return;
        }
        // Apply feature flag filtering
        if (!notificationFeature.global_enabled) {
            // Filter tokens to only include allowed ones
            const allowedTokens = notificationFeature.allowed_tokens || [];
            tokens = tokens.filter((token) => allowedTokens.includes(token));
            console.log("Feature not globally enabled. Filtered to " +
                `${tokens.length} allowed tokens from ${allowedTokens.length} ` +
                "in allowlist.");
            if (tokens.length === 0) {
                console.log("No allowed tokens found for this feature.");
                res.status(200).send("No allowed tokens found for this feature.");
                return;
            }
        }
        // Validate and prepare notifications
        const expo = new Expo();
        const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));
        console.log(`Validated ${validTokens.length} tokens out of ${tokens.length} total`);
        if (validTokens.length === 0) {
            console.log("No valid Expo push tokens found.");
            res.status(200).send("No valid Expo push tokens found.");
            return;
        }
        const messages = validTokens.map((token) => ({
            to: token,
            title: notificationTitle,
            body: notificationBody,
            sound: "default",
            priority: "high",
            channelId: "article-notifications",
            data: {
                screen: "/(tabs)",
                type: "article", // Specify this is an article notification
            },
        }));
        // Chunk and send notifications
        const chunks = expo.chunkPushNotifications(messages);
        console.log(`Sending notifications in ${chunks.length} chunks`);
        const tickets = [];
        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
                console.log(`Successfully sent chunk with ${chunk.length} messages`);
                // Check for errors in tickets
                ticketChunk.forEach((ticket, index) => {
                    if (ticket.status === "error") {
                        console.error(`Error sending to token ${chunk[index].to}:`, ticket.message);
                    }
                });
            }
            catch (error) {
                console.error("Error sending notification chunk:", error);
            }
        }
        const successfulTickets = tickets.filter(ticket => ticket.status === "ok").length;
        const message = `Article notifications sent successfully: 
      ${successfulTickets}/${tickets.length} ` +
            `for ${newArticlesCount} new articles.`;
        console.log(message);
        res.status(200).send(message);
    }
    catch (error) {
        console.error("Error sending article notifications:", error);
        res.status(500).send("Failed to send article notifications.");
    }
});
//# sourceMappingURL=index.js.map
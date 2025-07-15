import { useEffect, useState } from 'react';
import gun from '../utils/gun';

// UUID used to create unique IDs for messages
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom React hook to manage chat messages using GUN.js
 * 
 * This hook:
 * - Subscribes to a specific "room" in GUN (e.g. a group chat or 1-on-1 chat)
 * - Listens for new messages in real-time
 * - Adds messages to local state
 * - Allows sending new messages
 * - Automatically syncs between peers (if connected)
 * 
 * @param {string} roomId - A unique identifier for the chat room (defaults to 'default-room')
 * @returns {object} - { messages: array, sendMessage: function }
 */
export default function useGunMessages(roomId = 'default-room') {
  // Local state to store chat messages
  const [messages, setMessages] = useState([]);

  // On mount (and when roomId changes), set up GUN subscription
  useEffect(() => {
    const gunRef = gun.get(roomId); // Reference the GUN "node" for this chat room

    // Listen for any new messages using `.map().on()`
    // This fires for every message added under the room node
    gunRef.map().on((data, key) => {
      // Validate the message
      if (data && data.text && data.timestamp) {
        // Add to local state, if not already there (avoid duplicates)
        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === key);
          if (!exists) {
            return [...prev, { id: key, ...data }]
              .sort((a, b) => a.timestamp - b.timestamp); // sort messages chronologically
          }
          return prev;
        });
      }
    });

    // Cleanup on unmount
    return () => gunRef.off(); // stop listening to GUN updates
  }, [roomId]);

  /**
   * Sends a new message to the GUN network
   *
   * @param {string} text - The actual message content
   * @param {string} sender - The name or ID of the sender (defaults to "anonymous")
   */
  const sendMessage = (text, sender = 'anonymous') => {
    const id = uuidv4(); // Generate a unique ID for the message
    const message = {
      text,
      sender,
      timestamp: Date.now(),
    };

    // Store the message in GUN using its unique ID
    gun.get(roomId).get(id).put(message);
  };

  // Return the messages and the send function to the component
  return { messages, sendMessage };
}

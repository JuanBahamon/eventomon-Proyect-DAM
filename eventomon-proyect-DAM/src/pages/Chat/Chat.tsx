import React, { useState, useEffect, useRef } from 'react';
import { IonPage, IonContent, IonFooter, IonSpinner } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import { db } from '../../helpers/Firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import styles from './Chat.module.scss';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario: user } = useAuthContext();
  const { events } = useEvents();
  const history = useHistory();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const event = events.find((e) => e.id === id);

  useEffect(() => {
    const messagesRef = ref(db, `chats/${id}/messages`);
    const unsub = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Message[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        list.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(list);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;
    const messagesRef = ref(db, `chats/${id}/messages`);
    await push(messagesRef, {
      text: text.trim(),
      userId: user.uid,
      userName: user.email?.split('@')[0] ?? 'User',
      timestamp: serverTimestamp(),
    });
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <IonPage>
      <IonContent className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => history.goBack()}>←</button>
          <div className={styles.headerInfo}>
            <h2 className={styles.headerTitle}>{event?.title ?? 'Chat'}</h2>
            <p className={styles.headerSub}>{event?.attendees ?? 0} attendees</p>
          </div>
        </div>

        {/* Messages */}
        {loading ? (
          <div className={styles.loading}>
            <IonSpinner name="crescent" color="warning" />
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.length === 0 && (
              <p className={styles.noMessages}>No messages yet. Be the first! 👋</p>
            )}
            {messages.map((msg) => {
              const isMe = msg.userId === user?.uid;
              return (
                <div
                  key={msg.id}
                  className={`${styles.messageBubble} ${isMe ? styles.myMessage : styles.otherMessage}`}
                >
                  {!isMe && <p className={styles.messageName}>{msg.userName}</p>}
                  <p className={styles.messageText}>{msg.text}</p>
                  <p className={styles.messageTime}>
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      : ''}
                  </p>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </IonContent>

      {/* Input */}
      <IonFooter className={styles.footer}>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="Write a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={styles.sendBtn}
            onClick={sendMessage}
            disabled={!text.trim()}
          >
            ➤
          </button>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Chat;
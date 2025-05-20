"use client";

import { useEffect, useState } from "react";

interface Message {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredContactMethod: "email" | "phone";
  message: string;
  createdAt: string;
}


export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then(setMessages)
      .catch((err) => console.error("שגיאה בשליפת הודעות:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>טוען הודעות...</p>;
  if (messages.length === 0) return <p>אין הודעות להצגה.</p>;

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4 text-center text-green-700'>
        הודעות מ'צור קשר'
      </h2>
      <ul className='space-y-4'>
        {messages.map((msg) => (
          <li key={msg._id} className='border p-4 rounded shadow'>
            <p className='text-sm text-gray-600 mb-1'>
              <strong>{msg.fullName}</strong> ({msg.email})
            </p>
            <p className='text-sm text-gray-600 mb-1'>
              <span className='font-medium'>טלפון:</span> {msg.phone}
            </p>
            <p className='text-sm text-gray-600 mb-1'>
              <span className='font-medium'>דרך מועדפת לחזרה:</span>{" "}
              {msg.preferredContactMethod === "phone" ? "טלפון" : "אימייל"}
            </p>
            <div className='text-sm text-gray-600 mb-1'>
              <span className='font-medium'>הודעה:</span>
              <p className='text-gray-800 mt-2 whitespace-pre-wrap'>
                {msg.message}
              </p>
            </div>
            <p className='text-xs text-gray-400 text-left mt-3'>
              נשלח בתאריך {new Date(msg.createdAt).toLocaleString("he-IL")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

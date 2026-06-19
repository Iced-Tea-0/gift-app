'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  showChips?: boolean;
  chips?: string[];
  showGifts?: boolean;
}

interface Gift {
  id: string;
  name: string;
  description: string;
}

const sampleGifts: Gift[] = [
  {
    id: '1',
    name: 'Luxury Candle Set',
    description: 'Premium scented candles for cosy moments',
  },
  {
    id: '2',
    name: 'Silk Pillowcase',
    description: 'Luxurious bedding for ultimate comfort',
  },
  {
    id: '3',
    name: 'Wellness Tea Collection',
    description: 'Curated herbal teas for relaxation',
  },
];

export default function GiftPlanningChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Hi! Who are you planning this gift for?',
    },
    {
      id: '2',
      type: 'user',
      text: 'My mum',
    },
    {
      id: '3',
      type: 'ai',
      text: 'How lovely! What is the occasion?',
    },
    {
      id: '4',
      type: 'user',
      text: 'Mothers Day',
    },
    {
      id: '5',
      type: 'ai',
      text: 'What is your budget?',
    },
    {
      id: '6',
      type: 'user',
      text: '£40',
    },
    {
      id: '7',
      type: 'ai',
      text: "Tell me a little about her — what does she love? You can pick from some options or describe her yourself",
      showChips: true,
      chips: ['Cosy homebody', 'Loves fashion', 'Foodie', 'Outdoorsy', 'Describe her myself'],
    },
    {
      id: '8',
      type: 'user',
      text: 'Cosy homebody',
    },
    {
      id: '9',
      type: 'ai',
      text: 'Perfect! Here are some gift ideas that would suit her perfectly. These options combine comfort, quality, and thoughtfulness.',
      showGifts: true,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      type: 'user',
      text: inputValue,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleChipClick = (chip: string) => {
    const userMessage: Message = {
      id: String(messages.length + 1),
      type: 'user',
      text: chip,
    };

    setMessages([...messages, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main
      className="min-h-screen text-white overflow-hidden flex flex-col"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top Bar */}
      <div className="relative z-10 flex items-center gap-4 px-8 py-6 border-b border-white/10">
        <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
          ← Back
        </Link>
        <h1 className="font-serif text-2xl font-bold">Plan a Gift</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex gap-4 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-slate-400/50">
                  G
                </div>
              )}

              <div
                className={`max-w-xl ${
                  message.type === 'user'
                    ? 'bg-white/10 border border-white/20 rounded-3xl px-6 py-3 backdrop-blur-md'
                    : 'bg-transparent'
                }`}
              >
                <p className="text-slate-100">{message.text}</p>
              </div>
            </div>

            {/* Suggestion Chips */}
            {message.showChips && message.chips && (
              <div className="ml-14 mt-4 flex flex-wrap gap-2">
                {message.chips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm text-slate-200 hover:bg-white/10 hover:border-white/40 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Gift Suggestions */}
            {message.showGifts && (
              <div className="ml-14 mt-6 grid grid-cols-3 gap-4">
                {sampleGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="bg-white/5 border border-white/20 rounded-lg p-4 backdrop-blur-md hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="w-full h-32 bg-white/10 rounded-lg mb-3"></div>
                    <h3 className="font-semibold text-slate-100 text-sm mb-1">
                      {gift.name}
                    </h3>
                    <p className="text-xs text-slate-300">{gift.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-slate-400/50">
              G
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative z-10 border-t border-white/10 bg-slate-950/50 backdrop-blur-md px-8 py-6">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-white/40 transition backdrop-blur-md"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}

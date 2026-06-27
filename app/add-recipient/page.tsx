'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  products?: Product[];
}

interface Product {
  title: string;
  price: string;
  image: string;
  url: string;
  rating: string;
  interest?: string;
}

export default function GiftPlanningChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Hi! Who are you planning this gift for?',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (overrideText?: string) => {
    const text = overrideText || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      type: 'user',
      text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    const history = updatedMessages.map((m) => ({
      role: m.type === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }));

    const userCountry = navigator.language.split('-')[1] || 'US';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, country: userCountry }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          type: 'ai',
          text: data.reply,
          products: data.products || undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          type: 'ai',
          text: 'Something went wrong, please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
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
      <div className="relative z-10 flex items-center gap-4 px-8 py-6 border-b border-white/10">
        <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
          Back
        </Link>
        <h1 className="font-serif text-2xl font-bold">Plan a Gift</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((message, msgIndex) => (
          <div key={message.id}>
            <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-slate-900">
                  G
                </div>
              )}
              <div className={`max-w-xl ${message.type === 'user' ? 'bg-white/10 border border-white/20 rounded-3xl px-6 py-3 backdrop-blur-md' : 'bg-transparent'}`}>
                <p className="text-slate-100">{message.text}</p>
              </div>
            </div>

            {message.products && message.products.length > 0 && (
              <div className="ml-14 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.products.map((product, i) => (
                    <div
                      key={i}
                      onClick={() => window.open(product.url, '_blank')}
                      className="bg-white/5 border border-white/20 rounded-xl p-4 backdrop-blur-md hover:bg-white/10 transition cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                      {product.interest && (
                        <span className="text-xs text-amber-400 uppercase tracking-wide font-semibold mb-1 block">
                          {product.interest}
                        </span>
                      )}
                      <h3 className="font-semibold text-slate-100 text-sm mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-amber-400 font-bold text-sm">{product.price}</p>
                      {product.rating && (
                        <p className="text-xs text-slate-400 mt-1">⭐ {product.rating}</p>
                      )}
                    </div>
                  ))}
                </div>

                {msgIndex === messages.length - 1 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleQuickReply("Show me more like these")}
                      className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm text-slate-200 hover:bg-white/10 transition"
                    >
                      Show more like these
                    </button>
                    <button
                      onClick={() => handleQuickReply("Show me something completely different")}
                      className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-sm text-slate-200 hover:bg-white/10 transition"
                    >
                      Different category
                    </button>
                    <button
                      onClick={() => handleQuickReply("I've found the one I want to gift")}
                      className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-sm text-amber-300 hover:bg-amber-500/30 transition"
                    >
                      I'll go with one of these
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-slate-900">
              G
            </div>
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
            onClick={() => handleSendMessage()}
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
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

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

export default function ChatPage() {
  const { recipientId } = useParams();
  const [recipient, setRecipient] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedGiftUrls, setSavedGiftUrls] = useState<Set<string>>(new Set());
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadRecipient = async () => {
      const res = await fetch(`/api/recipients/${recipientId}`);
      const data = await res.json();
      if (data.recipient) {
        setRecipient(data.recipient);
        const r = data.recipient;
        if (data.recipient.chatHistory?.length > 0) {
          setMessages(data.recipient.chatHistory);
        } else {
          setMessages([{
            id: '1',
            type: 'ai',
            text: `Hey! 🎀 So here's what I know — we're finding a gift for ${r.name}${r.relationship ? ` (your ${r.relationship.toLowerCase()})` : ''} for ${r.occasion || 'a special occasion'}, with a budget of ${r.budget}. Love it! What do they do — are they a student, working, retired?`,
          }]);
        }
        if (data.recipient.savedGifts?.length > 0) {
          setSavedGiftUrls(new Set(data.recipient.savedGifts.map((g: any) => g.url)));
        }
      }
    };
    if (recipientId) loadRecipient();
  }, [recipientId]);

  useEffect(() => {
    if (!recipientId || messages.length === 0) return;
    const timer = setTimeout(() => {
      const saveable = messages.map(({ products, ...m }) => m);
      fetch(`/api/recipients/${recipientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatHistory: saveable }),
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [messages, recipientId]);

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

  const handleQuickReply = (text: string) => handleSendMessage(text);

  const handleSaveGift = async () => {
    if (!selectedProduct) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/recipients/${recipientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduct),
      });

      if (res.ok) {
        setSavedGiftUrls((prev) => new Set(prev).add(selectedProduct.url));
        setSavedSuccess(true);
        setShowSaveModal(false);
        setSelectedProduct(null);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      console.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden flex flex-col relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-10 text-7xl opacity-10 animate-float">✦</div>
        <div className="absolute bottom-1/4 left-20 text-6xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>✧</div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-4 px-8 py-6 border-b border-pink-200/40 bg-white/50 backdrop-blur-md">
        <Link href="/dashboard" className="text-gray-700 hover:text-pink-600 transition font-semibold">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {recipient ? `Planning for ${recipient.name} 🎀` : 'Plan a Gift'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 relative z-10 max-w-4xl mx-auto w-full pt-24">
        {messages.map((message, msgIndex) => (
          <div key={message.id}>
            <div className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full btn-gradient flex items-center justify-center font-bold text-white text-lg shadow-lg">
                  💝
                </div>
              )}
              <div className={`max-w-2xl ${message.type === 'user' ? 'btn-gradient text-white rounded-3xl px-6 py-3 shadow-lg' : 'glass-card rounded-2xl px-6 py-3'}`}>
                <p className={message.type === 'user' ? 'font-semibold' : 'text-gray-900 font-medium'}>{message.text}</p>
              </div>
            </div>

            {message.products && message.products.length > 0 && (
              <div className="ml-16 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {message.products.map((product, i) => (
                    <div key={i} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition group">
                      <img
                        src={product.image}
                        alt={product.title}
                        onClick={() => window.open(product.url, '_blank')}
                        className="w-full h-40 object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                      />
                      <div className="p-4">
                        {product.interest && (
                          <span className="inline-block btn-gradient text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                            {product.interest}
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{product.title}</h3>
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-pink-600 font-bold text-lg">{product.price}</p>
                          {product.rating && <p className="text-xs text-gray-600 font-semibold">⭐ {product.rating}</p>}
                        </div>
                        <button
                          onClick={() => { setSelectedProduct(product); setShowSaveModal(true); }}
                          disabled={savedGiftUrls.has(product.url)}
                          className={`w-full py-2 rounded-full text-sm font-bold transition ${
                            savedGiftUrls.has(product.url)
                              ? 'bg-green-100 text-green-600 cursor-default'
                              : 'btn-gradient text-white hover:shadow-lg'
                          }`}
                        >
                          {savedGiftUrls.has(product.url) ? '✓ Saved' : 'Save 🎀'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {msgIndex === messages.length - 1 && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => handleQuickReply('Show me more like these')}
                      className="glass-card text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition"
                    >
                      Show more like these
                    </button>
                    <button
                      onClick={() => handleQuickReply('Show me something completely different')}
                      className="glass-card text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition"
                    >
                      Different category
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full btn-gradient flex items-center justify-center font-bold text-white text-lg shadow-lg">
              💝
            </div>
            <div className="flex gap-2 items-center glass-card rounded-2xl px-4 py-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="relative z-20 border-t border-pink-200/50 glass px-8 py-6">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tell me about this person..."
            className="flex-1 bg-white border border-pink-300 rounded-full px-6 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="btn-gradient text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Save this gift? 🎀</h2>

            {allProducts.length > 1 && !selectedProduct && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {allProducts.map((product, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedProduct(product)}
                    className="glass-card rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
                  >
                    <img src={product.image} alt={product.title} className="w-full h-28 object-cover" />
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-900 line-clamp-2">{product.title}</p>
                      <p className="text-pink-600 font-bold text-sm mt-1">{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedProduct && (
              <div className="glass-card rounded-xl overflow-hidden mb-6">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-36 object-cover" />
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-900 line-clamp-2">{selectedProduct.title}</p>
                  <p className="text-pink-600 font-bold mt-1">{selectedProduct.price}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSaveModal(false); setSelectedProduct(null); setAllProducts([]); }}
                className="flex-1 glass-card text-gray-900 py-3 rounded-full hover:shadow-lg transition font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGift}
                disabled={!selectedProduct || saving}
                className="flex-1 btn-gradient text-white py-3 rounded-full hover:shadow-lg transition font-bold disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save it! 💝'}
              </button>
            </div>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-card border-2 border-pink-400 text-gray-900 px-6 py-3 rounded-full z-50 shadow-xl font-bold">
          Gift saved! 🎀
        </div>
      )}
    </main>
  );
}
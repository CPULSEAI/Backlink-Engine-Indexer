import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  ShieldAlert,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  Copy,
  Check,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model?: string;
}

const QUICK_PROMPTS = [
  '🛡️ How does the 403 Auto-Isolation Shield work?',
  '🚀 How to launch my first backlink campaign?',
  '🌐 How to test proxy latency & fix blocks?',
  '🤖 Explain GEO (Generative Engine Optimization)',
  '⚡ Setup Google Indexing API service account',
];

export const AiAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 **Hi there! I am your AutoSubmit Pro AI SEO Assistant.**\n\nI can help you troubleshoot proxy blocks, configure Google Indexing API keys, set up Smart Retries, or optimize your content for Generative Engines (ChatGPT, Perplexity & Google AI Overviews).\n\n*Select a topic below or ask me anything!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || inputMessage.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/assistant', {
        message: textToSend,
      });

      if (res.data && res.data.reply) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: res.data.model || 'gemini-3.7-flash',
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Connection Note**: Failed to reach AI service. ${err?.response?.data?.error || err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Launcher Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all cursor-pointer border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-zinc-950 animate-ping" />
          </div>
          <span className="text-xs tracking-wide">Gemini AI Assistant</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">3.7 Flash</span>
        </button>
      )}

      {/* Expandable Slide-Over Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Top Header */}
          <div className="px-4 py-3.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-sm shadow-indigo-500/30">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-zinc-100">Gemini SEO Assistant</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">Backlink &amp; Diagnostic Expert</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome',
                      sender: 'assistant',
                      text: `👋 **Chat reset!** How can I assist you with your backlink indexing, proxy latency, or GEO content optimization today?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                title="Reset Chat"
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 space-y-1.5 relative group ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none'
                      : 'bg-zinc-950 border border-zinc-800/90 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed space-y-1 text-xs">
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={idx} className="font-bold text-indigo-300 text-[13px] pt-1">
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('* ') || line.startsWith('- ')) {
                        return (
                          <li key={idx} className="ml-3 list-disc text-zinc-300">
                            {line.substring(2)}
                          </li>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-200 transition-opacity flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-zinc-400 text-xs font-mono">Gemini AI is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-3 py-2 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="whitespace-nowrap text-[10px] font-medium px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about 403 errors, proxies, GEO..."
              disabled={loading}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

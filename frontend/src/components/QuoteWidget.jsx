import { useState, useEffect } from 'react';
import { FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" }
];

export default function QuoteWidget() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    // Pick random quote on load
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const handleNewQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * quotes.length);
      } while (nextIndex === quoteIndex && quotes.length > 1);
      setQuoteIndex(nextIndex);
      setIsRotating(false);
    }, 300);
  };

  const currentQuote = quotes[quoteIndex];

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full group indigo-glow">
      {/* Background radial glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-700" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <FiTrendingUp className="w-3.5 h-3.5" />
          Focus Engine
        </span>
        <button
          onClick={handleNewQuote}
          disabled={isRotating}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-lg transition"
          aria-label="Refresh Quote"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[70px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <p className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base font-medium italic leading-relaxed">
              "{currentQuote?.text}"
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold mt-2 text-right">
              — {currentQuote?.author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

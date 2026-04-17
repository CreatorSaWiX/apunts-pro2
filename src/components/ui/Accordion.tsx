import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ 
    title = "Sense títol", 
    children, 
    defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Funció per permetre negretes en el títol (Markdown o HTML)
  const renderTitle = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|<strong>.*?<\/strong>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        return <strong key={i} className="font-bold text-white">{part.slice(8, -9)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.04]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="text-lg font-medium tracking-tight text-white/90">
            {renderTitle(title)}
        </span>
        <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
            }}
            className="text-white/30"
        >
            <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
                height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, ease: "linear" }
            }}
          >
            <div className="px-5 pb-6 pt-0">
                <div className="prose prose-invert max-w-none border-t border-white/5 pt-6">
                    {children}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface AutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  suggestions: string[];
  placeholder: string;
  className?: string;
  // Called when Enter is pressed and no suggestion is highlighted.
  onEnter?: (value: string) => void;
  ariaLabel?: string;
}

export function AutoComplete({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  className = '',
  onEnter,
  ariaLabel,
}: AutoCompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const query = value.trim().toLowerCase();
  const filteredSuggestions = query ? suggestions.filter((s) => s.toLowerCase().includes(query)) : [];
  const open = showSuggestions && filteredSuggestions.length > 0;

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!inputRef.current?.contains(target) && !suggestionsRef.current?.contains(target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const choose = (suggestion: string) => {
    onSelect(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        if (!filteredSuggestions.length) return;
        e.preventDefault();
        setShowSuggestions(true);
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1));
        break;
      case 'ArrowUp':
        if (!open) return;
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (open && highlightedIndex >= 0) {
          choose(filteredSuggestions[highlightedIndex]);
        } else {
          onEnter?.(value);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder}
          aria-autocomplete="list"
          aria-expanded={open}
          className={`w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-blue-400 ${className}`}
          autoComplete="off"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="listbox"
            className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  index === highlightedIndex ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/5'
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

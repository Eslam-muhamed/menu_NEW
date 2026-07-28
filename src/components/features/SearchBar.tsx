import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative group">
      <div
        className="relative flex items-center rounded-2xl overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: '#131328',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        {/* Search icon — right side for RTL */}
        <div className="absolute right-4 pointer-events-none z-10">
          <Search
            className="w-[18px] h-[18px] transition-colors duration-300"
            style={{ color: value ? '#c9993d' : '#4a4850' }}
          />
        </div>

        <input
          type="search"
          placeholder="ابحث عن منتج..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="rtl"
          className="w-full py-3.5 px-4 pr-12 bg-transparent focus:outline-none text-sm"
          style={{
            color: '#f0ece4',
            fontFamily: "'Cairo', 'Inter', system-ui, sans-serif",
            caretColor: '#c9993d',
          }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute left-3 flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-200 hover:bg-white/10 flex-shrink-0"
            aria-label="مسح البحث"
            style={{ color: '#7a7268' }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Gold focus ring */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: '1px solid rgba(201, 153, 61, 0.3)', boxShadow: '0 0 0 3px rgba(201, 153, 61, 0.06)' }}
      />
    </div>
  );
}

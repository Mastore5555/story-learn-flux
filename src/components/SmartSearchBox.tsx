import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { cn } from '@/lib/utils';

interface SmartSearchBoxProps {
  onSearch: (query: string, results: any[]) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearchBox = ({ 
  onSearch, 
  placeholder = "Busque por cursos, tecnologias ou temas...",
  className 
}: SmartSearchBoxProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { search, getSuggestions, loading } = useSemanticSearch();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim() && query.length >= 2) {
        const suggs = await getSuggestions(query);
        setSuggestions(suggs);
        setShowSuggestions(suggs.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, getSuggestions]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setShowSuggestions(false);
    const results = await search(searchQuery);
    onSearch(searchQuery, results);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const toggleAIMode = () => {
    setIsAIMode(!isAIMode);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn("relative max-w-2xl mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={isAIMode ? "Descreva o que você quer aprender..." : placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={cn(
              "pl-10 pr-20 py-3 text-lg",
              isAIMode && "border-primary bg-primary/5"
            )}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              variant={isAIMode ? "default" : "ghost"}
              size="sm"
              onClick={toggleAIMode}
              className="h-8 px-2"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              disabled={loading || !query.trim()}
              className="h-8"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                "Buscar"
              )}
            </Button>
          </div>
        </div>

        {isAIMode && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Busca com IA ativada - descreva o que você quer aprender</span>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">Sugestões</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular searches */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Populares:</span>
        {['JavaScript', 'React', 'Python', 'IA', 'Marketing Digital'].map((term) => (
          <Badge
            key={term}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => {
              setQuery(term);
              handleSearch(term);
            }}
          >
            {term}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SmartSearchBox;
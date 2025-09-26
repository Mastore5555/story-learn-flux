import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { SearchFilters } from "@/hooks/useSearch";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

const categories = [
  "Marketing Digital",
  "Inteligência Artificial", 
  "Programação",
  "Automação",
  "Design",
  "Data Science"
];

const levels = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" }
];

const durations = [
  { value: "short", label: "Até 1h" },
  { value: "medium", label: "1h - 3h" },
  { value: "long", label: "Mais de 3h" }
];

export const SearchFiltersComponent = ({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) => {
  const updateFilter = (key: keyof SearchFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value === undefined || value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-card/50 border border-border/50 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Filtros</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto h-8 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categoria */}
        <div>
          <label className="text-sm font-medium mb-2 block">Categoria</label>
          <Select 
            value={filters.category || undefined} 
            onValueChange={(value) => updateFilter('category', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nível */}
        <div>
          <label className="text-sm font-medium mb-2 block">Nível</label>
          <Select 
            value={filters.level || undefined} 
            onValueChange={(value) => updateFilter('level', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os níveis" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duração */}
        <div>
          <label className="text-sm font-medium mb-2 block">Duração</label>
          <Select 
            value={filters.duration || undefined} 
            onValueChange={(value) => updateFilter('duration', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qualquer duração" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Instrutor */}
        <div>
          <label className="text-sm font-medium mb-2 block">Instrutor</label>
          <Select 
            value={filters.instructor || undefined} 
            onValueChange={(value) => updateFilter('instructor', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os instrutores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Carlos Silva">Carlos Silva</SelectItem>
              <SelectItem value="Ana Costa">Ana Costa</SelectItem>
              <SelectItem value="Pedro Santos">Pedro Santos</SelectItem>
              <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>
              <SelectItem value="João Ferreira">João Ferreira</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                {filters.category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('category', undefined)}
                />
              </Badge>
            )}
            {filters.level && (
              <Badge variant="secondary" className="gap-1">
                {levels.find(l => l.value === filters.level)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('level', undefined)}
                />
              </Badge>
            )}
            {filters.duration && (
              <Badge variant="secondary" className="gap-1">
                {durations.find(d => d.value === filters.duration)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('duration', undefined)}
                />
              </Badge>
            )}
            {filters.instructor && (
              <Badge variant="secondary" className="gap-1">
                {filters.instructor}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('instructor', undefined)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
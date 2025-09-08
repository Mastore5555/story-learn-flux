import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Clock, User, BookOpen } from 'lucide-react';
import { useGeminiSuggestions } from '@/hooks/useGeminiSuggestions';
import { useNavigate } from 'react-router-dom';

const GeminiSuggestions = () => {
  const { suggestions, loading, fetchSuggestions, hasSuggestions } = useGeminiSuggestions();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Sugestões Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasSuggestions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Sugestões Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma sugestão ainda</h3>
          <p className="text-muted-foreground mb-4">
            Comece a fazer alguns cursos para receber recomendações personalizadas
          </p>
          <Button onClick={fetchSuggestions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Gerar Sugestões
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Sugestões Personalizadas
        </CardTitle>
        <Button
          onClick={fetchSuggestions}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {suggestions.map((course) => (
            <div
              key={course.id}
              className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <img
                src={course.thumbnail_url || '/placeholder.svg'}
                alt={course.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1 truncate">{course.title}</h4>
                
                {course.reason && (
                  <p className="text-xs text-primary mb-2 font-medium">
                    ✨ {course.reason}
                  </p>
                )}
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {course.instructor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(course.duration_minutes)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiSuggestions;
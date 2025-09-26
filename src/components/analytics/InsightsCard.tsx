import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InsightsCardProps {
  insights: string[];
  studyStreak: number;
  onRefresh?: () => void;
  loading?: boolean;
}

export function InsightsCard({ insights, studyStreak, onRefresh, loading }: InsightsCardProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-accent" />
            <CardTitle>Insights da IA</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Análises inteligentes do seu progresso de aprendizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Study Streak */}
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-medium">Sequência de Estudos</span>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {studyStreak} dias
          </Badge>
        </div>

        {/* Insights List */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="mt-0.5">
                {index === 0 && <TrendingUp className="w-4 h-4 text-accent" />}
                {index === 1 && <Clock className="w-4 h-4 text-primary" />}
                {index === 2 && <Target className="w-4 h-4 text-accent" />}
                {index === 3 && <Award className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 Insights gerados pela IA com base no seu comportamento de estudo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
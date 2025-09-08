import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Code2, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Clock,
  Users,
  Trophy,
  BookOpen
} from "lucide-react";

const categories = [
  {
    id: 'ai',
    title: 'Inteligência Artificial',
    description: 'Domine ferramentas de IA, prompt engineering e automação inteligente',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    courses: 12,
    students: 2500,
    level: 'Iniciante ao Avançado',
    duration: '25h'
  },
  {
    id: 'programming',
    title: 'Programação',
    description: 'Python, JavaScript, React e tecnologias modernas de desenvolvimento',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    courses: 18,
    students: 3200,
    level: 'Iniciante ao Expert',
    duration: '40h'
  },
  {
    id: 'marketing',
    title: 'Marketing Digital',
    description: 'Growth hacking, SEO, social media e estratégias de conversão',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    courses: 15,
    students: 1800,
    level: 'Iniciante ao Pro',
    duration: '30h'
  },
  {
    id: 'automation',
    title: 'Automação',
    description: 'No-code, workflows, integração de APIs e otimização de processos',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    courses: 10,
    students: 1200,
    level: 'Iniciante ao Avançado',
    duration: '20h'
  }
];

const CategorySection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Escolha Sua <span className="gradient-text">Trilha de Aprendizado</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada categoria foi cuidadosamente elaborada por especialistas da indústria
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.id}
                className="course-card glass rounded-xl p-8 border border-border/50 group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-smooth`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-smooth">
                    {category.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{category.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{category.students}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{category.level}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{category.courses} cursos</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Explorar Cursos
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
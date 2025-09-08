import CourseCard from "./CourseCard";

const featuredCourses = [
  {
    id: '1',
    title: 'Prompt Engineering Avançado com ChatGPT',
    description: 'Aprenda técnicas profissionais para extrair o máximo potencial da IA',
    instructor: 'Dr. Marcus Silva',
    duration: '4h 30min',
    level: 'Intermediário',
    rating: 4.9,
    students: 1250,
    lessons: 32,
    category: 'IA',
    thumbnail: '',
  },
  {
    id: '2',
    title: 'React.js do Zero ao Deploy',
    description: 'Construa aplicações modernas com React, TypeScript e melhores práticas',
    instructor: 'Ana Costa',
    duration: '8h 15min',
    level: 'Iniciante',
    rating: 4.8,
    students: 2100,
    lessons: 45,
    category: 'Programação',
    thumbnail: '',
  },
  {
    id: '3',
    title: 'Growth Hacking para SaaS',
    description: 'Estratégias comprovadas para escalar produtos digitais',
    instructor: 'Pedro Martins',
    duration: '3h 45min',
    level: 'Avançado',
    rating: 4.9,
    students: 890,
    lessons: 28,
    category: 'Marketing',
    thumbnail: '',
  },
  {
    id: '4',
    title: 'Zapier & Make.com Mastery',
    description: 'Automatize qualquer processo sem programar',
    instructor: 'Laura Santos',
    duration: '5h 20min',
    level: 'Iniciante',
    rating: 4.7,
    students: 1450,
    lessons: 38,
    category: 'Automação',
    thumbnail: '',
  }
];

const FeaturedCourses = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Cursos <span className="gradient-text">Mais Populares</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra os cursos que estão transformando carreiras na área tech
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCourses.map((course, index) => (
            <div 
              key={course.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const benefits = [
  "Acesso ilimitado a todos os cursos",
  "Novos conteúdos adicionados semanalmente",
  "Certificados de conclusão",
  "Suporte direto com instrutores",
  "Comunidade exclusiva de alunos",
  "Projetos práticos e reais"
];

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Floating Icons */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-float">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Pronto para <span className="gradient-text">Acelerar</span>
            <br />
            Sua Carreira?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já transformaram suas carreiras com a Techflix Academy
          </p>
          
          {/* Pricing Card */}
          <div className="glass rounded-2xl p-8 border border-border/50 max-w-md mx-auto mb-12 elevated">
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground mb-2">Assinatura Mensal</div>
              <div className="text-5xl font-bold gradient-text mb-2">R$ 97</div>
              <div className="text-sm text-muted-foreground">por mês • cancele quando quiser</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3 text-sm">
                  <div className="w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <Button variant="hero" size="lg" className="w-full text-lg py-6 mb-4">
              Começar Agora - 7 Dias Grátis
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Sem compromisso • Cancele a qualquer momento
            </p>
          </div>
          
          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5000+</div>
              <div className="text-sm text-muted-foreground">Alunos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">4.9/5</div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">24h</div>
              <div className="text-sm text-muted-foreground">Suporte Técnico</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
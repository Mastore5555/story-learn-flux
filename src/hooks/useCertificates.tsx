import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Certificate {
  id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  courses: {
    id: string;
    title: string;
    instructor: string;
    duration_minutes: number;
    category: string;
  };
}

export const useCertificates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    if (!user) {
      setCertificates([]);
      setLoading(false);
      return;
    }

    try {
      // Get certificates first
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select('id, course_id, certificate_number, issued_at')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

      if (certificatesError) throw certificatesError;

      if (!certificatesData || certificatesData.length === 0) {
        setCertificates([]);
        return;
      }

      // Get course details separately
      const courseIds = certificatesData.map(cert => cert.course_id);
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, instructor, duration_minutes, category')
        .in('id', courseIds);

      if (coursesError) throw coursesError;

      // Combine data
      const certificatesWithCourses = certificatesData.map(cert => {
        const course = coursesData?.find(c => c.id === cert.course_id);
        return {
          ...cert,
          courses: course || {
            id: cert.course_id,
            title: 'Curso não encontrado',
            instructor: '',
            duration_minutes: 0,
            category: ''
          }
        };
      });

      setCertificates(certificatesWithCourses);
    } catch (error) {
      console.error('Erro ao buscar certificados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os certificados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCertificatePDF = async (certificate: Certificate) => {
    try {
      // Simple certificate data for download
      const certificateData = {
        studentName: user?.user_metadata?.display_name || 'Estudante',
        courseName: certificate.courses.title,
        instructor: certificate.courses.instructor,
        completionDate: new Date(certificate.issued_at).toLocaleDateString('pt-BR'),
        certificateNumber: certificate.certificate_number,
        duration: `${Math.floor(certificate.courses.duration_minutes / 60)}h ${certificate.courses.duration_minutes % 60}m`
      };

      // Create a simple HTML certificate for printing
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificado - ${certificateData.courseName}</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 0; padding: 40px; background: #f5f5f5; }
            .certificate { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              padding: 60px; 
              border: 8px solid #2563eb;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { text-align: center; margin-bottom: 40px; }
            .title { font-size: 48px; color: #2563eb; margin-bottom: 20px; font-weight: bold; }
            .subtitle { font-size: 24px; color: #666; margin-bottom: 40px; }
            .content { text-align: center; line-height: 1.8; }
            .student-name { font-size: 36px; color: #1a365d; font-weight: bold; margin: 30px 0; }
            .course-name { font-size: 28px; color: #2563eb; font-weight: bold; margin: 20px 0; }
            .details { font-size: 18px; color: #666; margin: 30px 0; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; align-items: end; }
            .signature { text-align: center; border-top: 2px solid #333; padding-top: 10px; width: 200px; }
            .certificate-number { font-size: 14px; color: #999; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">CERTIFICADO</div>
              <div class="subtitle">de Conclusão de Curso</div>
            </div>
            
            <div class="content">
              <p>Certificamos que</p>
              <div class="student-name">${certificateData.studentName}</div>
              <p>concluiu com êxito o curso</p>
              <div class="course-name">${certificateData.courseName}</div>
              
              <div class="details">
                <p><strong>Instrutor:</strong> ${certificateData.instructor}</p>
                <p><strong>Duração:</strong> ${certificateData.duration}</p>
                <p><strong>Data de Conclusão:</strong> ${certificateData.completionDate}</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="signature">
                <div>Story Academy</div>
              </div>
              <div class="certificate-number">
                Certificado Nº: ${certificateData.certificateNumber}
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Open certificate in new window for printing
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(certificateHTML);
        newWindow.document.close();
        newWindow.focus();
        
        // Auto print after content loads
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.print();
          }, 100);
        };
      }

      toast({
        title: "Certificado gerado",
        description: "Uma nova janela foi aberta com seu certificado",
      });
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o certificado",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  return {
    certificates,
    loading,
    generateCertificatePDF,
    refetch: fetchCertificates
  };
};
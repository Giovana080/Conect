import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, Search, ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/navigation/bottom-nav";

export default function ConnectionsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get connections
  const {
    data: teacherConnections,
    isLoading: teachersLoading,
    error: teachersError,
  } = useQuery<any[]>({
    queryKey: ["/api/connections", { role: "student" }],
  });

  const {
    data: studentConnections,
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery<any[]>({
    queryKey: ["/api/connections", { role: "teacher" }],
  });
  
  const isLoading = teachersLoading || studentsLoading;
  const hasError = teachersError || studentsError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar conexões.</p>
      </div>
    );
  }
  
  // Mocking data for now
  const teachers = [
    {
      id: 1,
      name: 'Ana Martins',
      role: 'Professora de Inglês',
      rating: 4.5,
      reviews: 32,
      initials: 'AM',
      color: 'bg-secondary',
      skills: ['Inglês', 'Espanhol']
    },
    {
      id: 2,
      name: 'Rafael Silva',
      role: 'Professor de Programação',
      rating: 4.0,
      reviews: 47,
      initials: 'RS',
      color: 'bg-accent',
      skills: ['JavaScript', 'React', 'Design']
    }
  ];
  
  const requests = [
    {
      id: 1,
      name: 'Paula Lima',
      role: 'Professora de Matemática',
      initials: 'PL',
      color: 'bg-blue-500',
      skills: ['Matemática', 'Estatística'],
      message: 'Olá! Posso te ajudar com álgebra e estatística para o vestibular.'
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition mr-2"
          >
            <ArrowLeft className="text-lg text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-dark">Conexões</h1>
        </div>
      </header>
      
      <section className="px-6 py-6">
        {/* Tabs */}
        <Tabs defaultValue="teachers" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teachers">Professores</TabsTrigger>
            <TabsTrigger value="students">Alunos</TabsTrigger>
            <TabsTrigger value="requests">Pedidos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teachers" className="mt-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar professores"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-dark mb-3">Seus professores</h3>
            
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="flex items-start">
                  <div className={`w-14 h-14 rounded-full ${teacher.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xl`}>
                    {teacher.initials}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.role}</p>
                      </div>
                      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex">
                        {[...Array(Math.floor(teacher.rating))].map((_, i) => (
                          <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                        ))}
                        {teacher.rating % 1 !== 0 && (
                          <i className="ri-star-half-fill text-yellow-400 text-sm"></i>
                        )}
                        {[...Array(5 - Math.ceil(teacher.rating))].map((_, i) => (
                          <i key={i} className="ri-star-line text-yellow-400 text-sm"></i>
                        ))}
                      </div>
                      <span className="text-xs ml-1 text-gray-600">({teacher.reviews})</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {teacher.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button className="mr-2 flex-1">
                        Mensagem
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Agendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="students" className="mt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Você ainda não tem alunos conectados.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="mt-6">
            <h3 className="text-lg font-semibold text-dark mb-3">Solicitações de conexão</h3>
            
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-blue-200">
                <div className="flex items-start">
                  <div className={`w-14 h-14 rounded-full ${request.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xl`}>
                    {request.initials}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{request.name}</h4>
                        <p className="text-sm text-gray-600">{request.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                      {request.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{request.message}</p>
                    
                    <div className="flex justify-between">
                      <Button className="mr-2 flex-1">
                        Aceitar
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Recusar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Bottom Navigation */}
      <BottomNav active="connections" />
    </div>
  );
}

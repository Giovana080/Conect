import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, Skill, User, UserSkill } from "@shared/schema";
import { Loader2, Search, Bell } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import BottomNav from "@/components/navigation/bottom-nav";

export default function HomePage() {
  const { user } = useAuth();

  // Get categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["/api/categories/popular"],
  });

  // Get suggested teachers (for now, we'll simulate this)
  const {
    data: connections,
    isLoading: connectionsLoading,
    error: connectionsError,
  } = useQuery<any[]>({
    queryKey: ["/api/connections"],
  });

  // Get learning progress (user skills)
  const {
    data: userSkills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery<(UserSkill & { skill: Skill })[]>({
    queryKey: ["/api/user-skills"],
  });

  const isLoading = categoriesLoading || connectionsLoading || skillsLoading;
  const hasError = categoriesError || connectionsError || skillsError;

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
        <p className="text-red-500">Erro ao carregar dados.</p>
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(" ")[0] : user?.username;
  
  // This is a placeholder since we don't have real teacher suggestions yet
  const suggestedTeachers = [
    {
      id: 1,
      name: 'Ana Martins',
      skills: ['Inglês', 'Espanhol'],
      rating: 4.5,
      reviews: 32,
      initials: 'AM',
      color: 'bg-secondary'
    },
    {
      id: 2,
      name: 'Rafael Silva',
      skills: ['Programação', 'Design'],
      rating: 4.0,
      reviews: 47,
      initials: 'RS',
      color: 'bg-accent'
    }
  ];

  // This is a placeholder for learning progress
  const learningProgress = [
    {
      id: 1,
      name: 'Desenvolvimento Web',
      teacher: 'Carlos Oliveira',
      progress: 45,
      icon: 'ri-code-line',
      iconBg: 'bg-blue-100',
      iconColor: 'text-primary'
    },
    {
      id: 2,
      name: 'Inglês Intermediário',
      teacher: 'Ana Martins',
      progress: 72,
      icon: 'ri-english-input',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Conectidade</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <Search className="h-5 w-5 text-gray-700" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <Bell className="h-5 w-5 text-gray-700" />
            </button>
            <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="font-medium text-sm">{`${firstName?.charAt(0)}${firstName?.charAt(1) || ''}`}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-6 py-6">
        <h2 className="text-2xl font-bold text-dark mb-2">Olá, {firstName}!</h2>
        <p className="text-gray-600 mb-6">O que você gostaria de aprender hoje?</p>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-dark mb-3">Categorias populares</h3>
          <div className="flex overflow-x-auto pb-2 -mx-6 px-6 space-x-3">
            {categories?.map((category) => (
              <div key={category.id} className="flex-shrink-0 w-28 rounded-xl overflow-hidden">
                <div className="bg-blue-500 h-24 relative">
                  <img 
                    src={category.imageUrl || `https://ui-avatars.com/api/?name=${category.name}&background=random`} 
                    alt={category.name} 
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <p className="absolute bottom-2 left-2 text-white font-medium text-sm">{category.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Teachers */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-dark">Professores sugeridos</h3>
            <Link href="/connections" className="text-sm text-primary">Ver todos</Link>
          </div>

          {suggestedTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl p-4 shadow-sm mb-3 flex items-center">
              <div className={`w-14 h-14 rounded-full ${teacher.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xl`}>
                {teacher.initials}
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-medium">{teacher.name}</h4>
                <p className="text-sm text-gray-600">{teacher.skills.join(', ')}</p>
                <div className="flex items-center mt-1">
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
              </div>
              <button className="ml-2 p-2 rounded-full bg-blue-50 text-primary hover:bg-blue-100 transition">
                <i className="ri-user-add-line"></i>
              </button>
            </div>
          ))}
        </div>

        {/* Learning Progress */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-dark">Seu aprendizado</h3>
            <Link href="/skills" className="text-sm text-primary">Ver tudo</Link>
          </div>

          {learningProgress.map((course) => (
            <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm mb-3">
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-lg ${course.iconBg} flex items-center justify-center ${course.iconColor}`}>
                  <i className={`${course.icon} text-lg`}></i>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">{course.name}</h4>
                  <p className="text-xs text-gray-500">Com {course.teacher}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${course.progress > 50 ? 'bg-secondary' : 'bg-primary'} h-2 rounded-full`} 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav active="home" />
    </div>
  );
}

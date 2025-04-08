import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Category } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/navigation/bottom-nav";

export default function SpecialtiesPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get categories
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar especialidades.</p>
      </div>
    );
  }
  
  const popularCategories = categories?.slice(0, 4) || [];
  const allCategories = categories || [];
  
  const filteredCategories = searchQuery 
    ? allCategories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCategories;

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
          <h1 className="text-xl font-bold text-dark">Especialidades</h1>
        </div>
      </header>
      
      <section className="px-6 py-6">
        <p className="text-gray-600 mb-6">Explore áreas específicas de conhecimento para aprender ou ensinar.</p>
        
        {/* Search Specialties */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar especialidades"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Popular Specialties Grid */}
        {!searchQuery && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-dark mb-3">Especialidades Populares</h3>
            <div className="grid grid-cols-2 gap-3">
              {popularCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-28 relative">
                    <img 
                      src={category.imageUrl || `https://ui-avatars.com/api/?name=${category.name}&background=random`} 
                      alt={category.name} 
                      className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-2 left-3">
                      <h4 className="text-white font-medium">{category.name}</h4>
                      <p className="text-xs text-white/80">
                        {Math.floor(Math.random() * 100) + 30} professores
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* All Specialties */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-dark">
              {searchQuery ? 'Resultados da busca' : 'Todas as especialidades'}
            </h3>
            <Button variant="ghost" size="sm" className="text-primary p-0">
              Filtrar
            </Button>
          </div>
          
          <div className="bg-white rounded-xl divide-y divide-gray-100">
            {filteredCategories.map((category) => (
              <div key={category.id} className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary mr-3">
                  <i className={`ri-${category.iconName || 'bookmark-line'}`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-xs text-gray-500">
                    {Math.floor(Math.random() * 100) + 30} professores disponíveis
                  </p>
                </div>
                <button className="ml-2 p-2 rounded-full bg-blue-50 text-primary hover:bg-blue-100 transition">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Bottom Navigation */}
      <BottomNav active="specialties" />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      userType: "learn",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col justify-center bg-gray-50">
      {activeForm === "login" ? (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Conectidade</h1>
          <p className="text-gray-600">
            Conectando quem quer aprender com quem quer ensinar
          </p>
        </div>
      ) : (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Criar Conta</h1>
          <p className="text-gray-600">Entre para a comunidade Conectidade</p>
        </div>
      )}

      {activeForm === "login" ? (
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-1 text-right">
                        <a
                          href="#"
                          className="text-sm text-primary hover:underline"
                        >
                          Esqueceu a senha?
                        </a>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full mb-6">
          <CardContent className="pt-6">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mínimo 8 caracteres"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Repita sua senha"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Eu quero:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex-1">
                            <FormItem className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg border-2 border-transparent cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-blue-50">
                              <FormControl>
                                <RadioGroupItem
                                  value="learn"
                                  className="sr-only"
                                />
                              </FormControl>
                              <i className="ri-book-open-line text-2xl mb-2 text-primary"></i>
                              <FormLabel className="font-medium">
                                Aprender
                              </FormLabel>
                            </FormItem>
                          </div>

                          <div className="flex-1">
                            <FormItem className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg border-2 border-transparent cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-blue-50">
                              <FormControl>
                                <RadioGroupItem
                                  value="teach"
                                  className="sr-only"
                                />
                              </FormControl>
                              <i className="ri-graduation-cap-line text-2xl mb-2 text-primary"></i>
                              <FormLabel className="font-medium">
                                Ensinar
                              </FormLabel>
                            </FormItem>
                          </div>

                          <div className="flex-1">
                            <FormItem className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg border-2 border-transparent cursor-pointer data-[state=checked]:border-primary data-[state=checked]:bg-blue-50">
                              <FormControl>
                                <RadioGroupItem
                                  value="both"
                                  className="sr-only"
                                />
                              </FormControl>
                              <i className="ri-exchange-line text-2xl mb-2 text-primary"></i>
                              <FormLabel className="font-medium">
                                Ambos
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cadastrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        {activeForm === "login" ? (
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <button
              onClick={() => setActiveForm("register")}
              className="text-primary font-medium hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        ) : (
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <button
              onClick={() => setActiveForm("login")}
              className="text-primary font-medium hover:underline"
            >
              Faça login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user } = useAuth();

  return (
    <Route path={path}>
      {!user ? (
        <Redirect to="/auth" />
      ) : (
        <Component />
      )}
    </Route>
  );
}

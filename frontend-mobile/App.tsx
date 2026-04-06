import React, { useEffect } from "react";
import { useAuthStore } from "./src/store/useAuthStore";
import LoadingState from "./src/components/LoadingState";
import AppNavigator from "./src/navigation/AppNavigator";
import AppShell from "./src/components/AppShell";

export default function App() {
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  if (!hydrated) {
    return (
      <AppShell>
        <LoadingState label="Preparando seu ambiente de aprendizagem..." />
      </AppShell>
    );
  }

  return <AppNavigator />;
}

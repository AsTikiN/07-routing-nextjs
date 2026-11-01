"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import css from "./TanStackProvider.module.css";

interface TanStackProviderProps {
  children: ReactNode;
}

export default function TanStackProvider({ children }: TanStackProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <div className={css.root}>{children}</div>
    </QueryClientProvider>
  );
}

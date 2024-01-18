import { AuthContextProvidor } from "@/context/AuthContext";
import { GutContextProvider } from "@/context/GutContext";
import { HistoryContextProvider } from "@/context/HistoryContext";
import React, { ReactNode } from "react";

type ContextProvidor = {
  children: ReactNode
}

const ContextProvidor: React.FC<ContextProvidor> = ({ children }) => {
  return (
    <>
      <HistoryContextProvider>
        <AuthContextProvidor>
          <GutContextProvider>
            {children}
          </GutContextProvider>
        </AuthContextProvidor>
      </HistoryContextProvider>
    </>
  );
}

export default ContextProvidor;

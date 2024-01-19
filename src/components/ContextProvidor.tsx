import { AuthContextProvidor } from "@/context/AuthContext";
import { GutContextProvider } from "@/context/GutContext";
import { HistoryContextProvider } from "@/context/HistoryContext";
import { RacketContextProvider } from "@/context/RacketContext";
import { ReviewContextProvider } from "@/context/ReviewContext";
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
            <RacketContextProvider>
              <ReviewContextProvider>
                {children}
              </ReviewContextProvider>
            </RacketContextProvider>
          </GutContextProvider>
        </AuthContextProvidor>
      </HistoryContextProvider>
    </>
  );
}

export default ContextProvidor;

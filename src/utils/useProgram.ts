import { createContext, useContext } from "react";

export interface ProgramContextState{
    getCoinAmount(coinType: string) : Promise<number>;
    getPoolIdoData() : Promise<any>;
    getIdoContribution(table: string) : Promise<number>;
    ido_commit(amount: number) : Promise<any>;
    ido_claim() : Promise<any>;
}

export const ProgramContext = createContext<ProgramContextState>({
} as ProgramContextState)

export function useProgram() : ProgramContextState{
    return useContext(ProgramContext)
}
import {FC, useCallback, ReactNode,} from 'react'
import { ProgramContext } from './useProgram'
import { useWallet, useSuiProvider, } from '@suiet/wallet-kit'
import { TransactionBlock } from '@mysten/sui.js'
import { InfoIdo } from './constants'

export interface ProgramProviderProps{
    children : ReactNode
}

export const ProgramProvider: FC<ProgramProviderProps> = ({children}) => {
    const wallet = useWallet()
    const provider = useSuiProvider(wallet.chain?.rpcUrl!)

    const getCoinAmount = async(coinType : string) => {
        try{
            let coins = (await provider.getCoins({
                owner: wallet.address!,
                coinType: coinType
            })).data
            let total = 0;
            for(let item of coins)
                total+=Number(item.balance)
            return total
        }catch(err){
            return 0
        }
    }

    const getPoolIdoData = async() => {
        try{
            let res = (await provider.getObject({id: InfoIdo.pool, options: {showContent: true}})).data
            if(res?.content?.dataType==="moveObject")
                return res.content.fields
            else
                return null
        }catch(err){
            return null
        }
    }

    const getIdoContribution = async(table: string) => {
        try{
            let ido = (await provider.getDynamicFieldObject({parentId: table, name:{type:"address",value:wallet.address}})).data
            if(ido?.content?.dataType==="moveObject"){
                return Number(ido.content.fields.value)
            }else{
                return 0
            }
        }catch(err){
            return 0
        }
    }

    const ido_commit = useCallback(async(commitAmount: number)=>{
        let amount = commitAmount * (10 ** InfoIdo.token.decimals)
        if(amount===0) throw new Error("Invalid Amount");
        let coins = (await provider.getCoins({
            owner: wallet.address!,
            coinType: "0x2::sui::SUI"
        })).data
        if(coins.length===0) throw new Error("No token");
        let total=0;
        for(let item of coins) total+=Number(item.balance)
        if(total<amount) throw new Error("Not Enough Token")
        const tx = new TransactionBlock()
        if(coins.length>1){
            tx.mergeCoins(tx.gas, coins.slice(0,coins.length).map(item=>{return tx.object(item.coinObjectId)}))
        }
        // const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)])
        // tx.transferObjects([coin], tx.pure(wallet.address))
        tx.moveCall({
            target: `${InfoIdo.contract}::IDO::commit`,
            typeArguments:[
                InfoIdo.token.address
            ],
            arguments:[
                tx.object(InfoIdo.pool),
                tx.gas,
                // {kind:"Result", index: 0},
                tx.pure(amount),
                tx.object("0x6")
            ]
        })
        // await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet, provider])

    const ido_claim = useCallback(async()=>{
        const tx = new TransactionBlock()
        tx.moveCall({
            target: `${InfoIdo.contract}::IDO::claim`,
            typeArguments:[
                InfoIdo.token.address
            ],
            arguments:[
                tx.object(InfoIdo.pool),
                tx.object("0x6"),
            ]
        })
        // await wallet.signAndExecuteTransactionBlock({transactionBlock: tx})
    },[wallet])

    return <ProgramContext.Provider value={{
        getCoinAmount,
        getPoolIdoData,
        getIdoContribution,
        ido_commit,
        ido_claim,
    }}>{children}</ProgramContext.Provider>
}
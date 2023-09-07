import {notification} from 'antd'

export const InfoIdo = {
    token: {
        name: "SUF Token",
        symbol: "SUF",
        contract: "0x62ac2205c90d6638ca1642368d085aceff9c8ca1054df6d482024df40788facf",
        address: "0x62ac2205c90d6638ca1642368d085aceff9c8ca1054df6d482024df40788facf::SUF::SUF",
        link: "https://suiexplorer.com/object/0x62ac2205c90d6638ca1642368d085aceff9c8ca1054df6d482024df40788facf",
        decimals: 9,
    },
    contract: "0x69fb0270d7f988c90ca8926edb05189a0c2be60423e280b6a01591db282479f7",
    link: "https://suiexplorer.com/object/0x69fb0270d7f988c90ca8926edb05189a0c2be60423e280b6a01591db282479f7?module=IDO",
    pool: "0xce0e7e5986e70522a44a9702a3db03169bdbc1f4c44009b47cfd1d06e64d9696",
    table: "0xafe25a100acd43acabe5ac29a7c8a214c2da68463d218f8cdc7378ccc658a380",
    suiDecimals: 9,
    idoSupply: "20,000,000",
    startTime: "1PM UTC 5/9",
    endTime: "1PM UTC 5/12",
    startTimeStr: "2023/5/9 13:00 UTC",
    endTimeStr: "2023/5/12 13:00 UTC",
    rate: "80"
}

export const openNotification = (type : 'success' | 'error' | 'info' | 'warning', title : string, description? : string) => {
    notification[type]({
        message : title, description : description, placement : 'topLeft'
    })
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
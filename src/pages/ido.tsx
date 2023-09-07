import { useEffect, useState, useCallback } from "react"
import { useProgram } from "../utils/useProgram"
import { useWallet } from "@suiet/wallet-kit"
import { CircularProgress, circularProgressClasses, Button, Skeleton, Tooltip, IconButton } from "@mui/material"
import { InfoIdo, openNotification } from '../utils/constants'
import { ContentCopyRounded as CopyIcon } from "@mui/icons-material";
import LogoIMG from '../assets/images/logopng.png'
import SuiLogoIMG from '../assets/images/SUI.png'
import Timer from "../components/timer"

export default function IdoPage(){
    const wallet = useWallet()
    const { getPoolIdoData, ido_commit, getIdoContribution, ido_claim } = useProgram()
    const [currentTime, setCurrentTime] = useState(new Date().getTime())
    const [poolData, setPoolData] = useState<any>(null)
    const [commitAmount, setCommitAmount] = useState("")
    const [userContribution, setUserContribution] = useState(0)
    const [isButtonLoading, setIsButtonLoading] = useState(false)

    useEffect(()=>{
        const interval = setInterval(()=>{getPoolData()}, 5000)
        return ()=>clearInterval(interval)
    },[])

    useEffect(()=>{
        const interval = setInterval(()=>{getContribution()}, 5000)
        return ()=>clearInterval(interval)
    },[poolData])

    useEffect(()=>{
        getContribution()
    },[poolData])

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentTime(new Date().getTime())
        },1000)
        return ()=>clearInterval(interval)
    },[])

    const getPoolData = useCallback(async() => {
        let pd = await getPoolIdoData()
        if(pd!=null){
            setPoolData({...pd,
                soft_cap: Number(pd.soft_cap),
                hard_cap: Number(pd.hard_cap),
                start_time: Number(pd.start_time),
                end_time: Number(pd.end_time),
                min_commit: Number(pd.min_commit),
                max_commit: Number(pd.max_commit),
                rate: Number(pd.rate),
                amount: Number(pd.amount)
            })
        }else{
            setPoolData(null)
        }
    },[])

    const getContribution = useCallback(async() => {
        if(poolData==null){
            setUserContribution(0)
        }else{
            // setUserContribution(await getIdoContribution(poolData.account_commit_table.fields.id.id))
            setUserContribution(await getIdoContribution(InfoIdo.table))
        }
    },[poolData])

    return <div className="ido-dashboard">
        <div className="ido-main-panel">
            <div className="ido-main-banner">
            ALL PARTICIPANTS THAT CONTRIBUTE ABOVE  90 $SUI  WILL GET 1 FREE COSMOCADIA NFT
            </div>
            <div className="ido-main-wrapper">
                <div className="ido-info-panel">
                    <h3 className="ido-info-panel-header">IDO Information</h3>
                    <hr className="ido-info-panel-underline"/>
                    <div className="ido-info-panel-content">
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Token</div>
                            <div className="ido-info-item-value">{InfoIdo.token.name}</div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Symbol</div>
                            <div className="ido-info-item-value">{InfoIdo.token.symbol}&nbsp;<img src={LogoIMG} alt="logo" width="20px"/></div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Token Address</div>
                            <div className="ido-info-item-value">
                                <a rel="noreferrer" href={InfoIdo.token.link} target="_blank">{InfoIdo.token.contract.substr(0,4)+"..."+InfoIdo.token.contract.substr(-4,4)}</a>&nbsp;
                                <Tooltip title="Copy" placement="top" arrow >
                                    <IconButton  onClick={()=>{
                                        navigator.clipboard.writeText(InfoIdo.token.contract)
                                    }}><CopyIcon sx={{fontSize:"20px", color: "rgb(118, 139, 173)"}}/></IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">IDO Contract</div>
                            <div className="ido-info-item-value">
                                <a rel="noreferrer" href={InfoIdo.link} target="_blank">{InfoIdo.pool.substr(0,4)+"..."+InfoIdo.pool.substr(-4,4)}</a>&nbsp;
                                <Tooltip title="Copy" placement="top" arrow >
                                    <IconButton  onClick={()=>{
                                        navigator.clipboard.writeText(InfoIdo.pool)
                                    }}><CopyIcon sx={{fontSize:"20px", color: "rgb(118, 139, 173)"}}/></IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">IDO Supply</div>
                            <div className="ido-info-item-value">{InfoIdo.idoSupply}&nbsp;<img src={LogoIMG} alt="logo" width="20px"/>(20%)</div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">IDO Rate</div>
                            <div className="ido-info-item-value">
                            {
                                poolData!=null && poolData.rate!==undefined ?
                                    <>1&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/>&nbsp;=&nbsp;{poolData.rate/(10**9)}&nbsp;<img src={LogoIMG} alt="logo" width="20px"/></>
                                :
                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={120} height={24}/>
                            }    
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Max Buy</div>
                            <div className="ido-info-item-value">
                            {
                                poolData!=null ?
                                    <>{poolData.max_commit/(10**InfoIdo.suiDecimals)}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                :
                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                            }
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Min Buy</div>
                            <div className="ido-info-item-value">
                            {
                                poolData!=null ?
                                    <>{poolData.min_commit/(10**InfoIdo.suiDecimals)}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                :
                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                            }
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Hard Cap</div>
                            <div className="ido-info-item-value">
                            {
                                poolData!=null ?
                                    <>{(poolData.hard_cap/(10**InfoIdo.suiDecimals)).toLocaleString()}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                :
                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                            }
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Soft Cap</div>
                            <div className="ido-info-item-value">
                            {
                                poolData!=null ?
                                    <>{(poolData.soft_cap/(10**InfoIdo.suiDecimals)).toLocaleString()}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                :
                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                            }
                            </div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Time</div>
                            <div className="ido-info-item-value">{InfoIdo.startTime+" ~ "+InfoIdo.endTime}</div>
                        </div>
                        <div className="ido-info-item">
                            <div className="ido-info-item-name">Listing on</div>
                            <div className="ido-info-item-value">5/17 on&nbsp;<a rel="noreferrer" href="https://cetus.zone" target="_blank">CETUS DEX</a></div>
                        </div>
                    </div>
                </div>
                <div className="ido-action-panel">
                {
                    poolData==null ?
                        <div style={{textAlign: "center"}}><CircularProgress disableShrink size={200}/></div>
                    :
                    currentTime<Number(poolData.start_time) ?
                        <div className="ido-prev-status">
                            <Timer targetTime={Number(poolData.start_time)}/>
                            <h2>IDO PRESALE <span>SOON</span>!</h2>
                        </div>
                    :
                        <>
                            <div className="ido-current-status">
                                {
                                    currentTime<Number(poolData.end_time) ?
                                        <Timer targetTime={Number(poolData.end_time)}/>
                                    :
                                    poolData.soft_cap <= poolData.amount ?
                                        <p className="success-banner banner">PRESALE SUCCESS!</p>
                                    :
                                        <p className="failed-banner banner">PRESALE FAILED</p>
                                }
                                <div className="ido-commit-status">
                                    <div className="ido-commit-circle-wrapper">
                                        <CircularProgress variant="determinate" value={100} size={200} sx={{color:"gray"}}/>
                                        <CircularProgress variant="determinate" value={Math.floor(poolData.amount/poolData.hard_cap*100)} size={200} sx={{
                                            position: "absolute",
                                            color: poolData.amount>poolData.soft_cap ? "#00ff33" : "#ffd044",
                                            [`& .${circularProgressClasses.circle}`]:{
                                                strokeLinecap: 'round',
                                            }
                                        }}/>
                                        <div className="ido-commit-circle-label">
                                            <p>{Math.floor(poolData.amount/poolData.hard_cap*100)+" %"}</p>
                                        </div>
                                    </div>
                                    <div className="ido-commit-value">
                                        <div className="ido-info-item">
                                            <div className="ido-info-item-name">Hard Cap</div>
                                            <div className="ido-info-item-value">
                                            {
                                                poolData!=null ?
                                                    <>{(poolData.hard_cap/(10**InfoIdo.suiDecimals)).toLocaleString()}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                                :
                                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                                            }
                                            </div>
                                        </div>
                                        <div className="ido-info-item">
                                            <div className="ido-info-item-name">Soft Cap</div>
                                            <div className="ido-info-item-value">
                                            {
                                                poolData!=null ?
                                                    <>{(poolData.soft_cap/(10**InfoIdo.suiDecimals)).toLocaleString()}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                                :
                                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                                            }
                                            </div>
                                        </div>
                                        <div className="ido-info-item">
                                            <div className="ido-info-item-name">Total Raised</div>
                                            <div className="ido-info-item-value">
                                            {
                                                poolData!=null ?
                                                    <>{(poolData.amount/(10**InfoIdo.suiDecimals)).toLocaleString()}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                                :
                                                    <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ido-current-wallet-status">
                                <div className="ido-info-item" style={{margin: "4px auto"}}>
                                    <div className="ido-info-item-name">Maximum Buy</div>
                                    <div className="ido-info-item-value">
                                    {
                                        poolData!=null ?
                                            <>{poolData.max_commit/(10**InfoIdo.suiDecimals)}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                        :
                                            <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                                    }
                                    </div>
                                </div>
                                <div className="ido-info-item" style={{margin: "4px auto"}}>
                                    <div className="ido-info-item-name">Minimum Buy</div>
                                    <div className="ido-info-item-value">
                                    {
                                        poolData!=null ?
                                            <>{poolData.min_commit/(10**InfoIdo.suiDecimals)}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></>
                                        :
                                            <Skeleton variant="rectangular" sx={{bgcolor:"gray"}} width={80} height={24}/>
                                    }
                                    </div>
                                </div>
                                {
                                    wallet.connected &&
                                    <div className="ido-info-item" style={{margin: "4px auto"}}>
                                        <div className="ido-info-item-name">Your Contribution</div>
                                        <div className="ido-info-item-value">{userContribution/(10**InfoIdo.suiDecimals)}&nbsp;<img src={SuiLogoIMG} alt="logo" width="20px"/></div>
                                    </div>
                                }
                                <hr style={{opacity: 0.2}}/>
                                <div className="amount-input-wrapper">
                                    <input type="number" className="amount-input" disabled={currentTime>Number(poolData.end_time)} placeholder="Enter an amount" min="0" step="0.1" onChange={(e)=>{setCommitAmount(e.target
                                        .value)}} value={commitAmount} />
                                </div>
                                {
                                    isButtonLoading ? 
                                        <Button variant="contained" color="success" className="btn-buy"><CircularProgress color="inherit" disableShrink/></Button>
                                    :
                                    currentTime<=Number(poolData.end_time) ?
                                        <Button variant="contained" color="success" className="btn-buy" onClick={async()=>{
                                            setIsButtonLoading(true)
                                            try{
                                                await ido_commit(Number(commitAmount))
                                                openNotification('success', 'Buy Success!')
                                            }catch(err: any){
                                                openNotification('error', err.message)
                                            }
                                            setIsButtonLoading(false)
                                        }}>BUY</Button>
                                    :
                                    poolData.soft_cap < poolData.amount ?
                                        <Button variant="contained" color="success" className="btn-claim-success" onClick={async()=>{
                                            setIsButtonLoading(true)
                                            try{
                                                await ido_claim()
                                                openNotification('success', 'Claim Success!')
                                            }catch(err: any){
                                                openNotification('error', err.message)
                                            }
                                            setIsButtonLoading(false)
                                        }}>Claim ({userContribution/(10**InfoIdo.suiDecimals)*poolData.rate/(10**9)} CMC)</Button>
                                    :
                                        <Button variant="contained" color="secondary" className="btn-claim-success" onClick={async()=>{
                                            setIsButtonLoading(true)
                                            try{
                                                await ido_claim()
                                                openNotification('success', 'Claim Success!')
                                            }catch(err: any){
                                                openNotification('error', err.message)
                                            }
                                            setIsButtonLoading(false)
                                        }}>Claim ({userContribution/(10**InfoIdo.suiDecimals)} SUI)</Button>
                                }
                            </div>
                        </>
                }
                </div>
            </div>
        </div>
    </div>
}
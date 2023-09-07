import { useEffect, useState } from "react"

const useCountdown = (targetDate : any) => {
    const countDownDate = new Date(targetDate).getTime()
    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime())

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCountDown(countDownDate - new Date().getTime())
        },1000)
        return ()=>clearInterval(interval)
    },[countDownDate])

    const getReturnValues = (countDown : number) => {
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
        const hours = Math.floor((countDown % (1000 * 60 * 60 * 24))/(1000 * 60 * 60))
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000)
        return [days, hours, minutes, seconds]
    }

    return getReturnValues(countDown);
}

const DateTimeDisplay = (props: any) => {
    return <div className="countdown">
        <p>{props.value>=10 ? props.value : "0"+props.value}</p>
        <span>{props.type}</span>
    </div>
}
export default function Timer(props: any){
    const [days, hours, minutes, seconds] = useCountdown(props.targetTime)
    return <div className="show-counter">
        <DateTimeDisplay value={days} type="Days"/>
        <p>:</p>
        <DateTimeDisplay value={hours} type="Hours"/>
        <p>:</p>
        <DateTimeDisplay value={minutes} type="Minutes"/>
        <p>:</p>
        <DateTimeDisplay value={seconds} type="Seconds"/>
    </div>
}
'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './page.module.css'  
import dotenv from 'dotenv'

dotenv.config();

export default function Page() {
    /** 파일 업로드 여부 */
    const [uploaded, setUploaded] = useState<boolean>(false);

    let room : Room | null = null;

    /** 브라우저 변경 권고 */
    useEffect(() => {!navigator.userAgent.toLowerCase().includes('edg') && alert("이 사이트를 편안하게 호스팅 하려면 Microsoft Edge 브라우저 사용을 권장합니다")},[])

    /** 파일 업로드 DOM과 비디오 DOM */
    const [content, setContent] = useState<JSX.Element>((<><label htmlFor='fileUpload' className={styles.fileUpload}>PDF 업로드</label>
    <input type="file" id='fileUpload' accept=".pdf" className={styles.fileUpload} onChange={() => 
    {
        setUploaded(true);
    }}/></>))

    /** 비디오 DOM Ref */
    const videoElem = useRef<HTMLVideoElement>(null);

    /** 파일 업로드 여부에 따른 DOM 로드 */
    useEffect(() => {uploaded 
    ? setContent(<div className={styles.content_frame}><video id='video' className={styles.video} ref={videoElem} autoPlay></video><button className={styles.stop} onClick={stopCapture}>정지</button></div>)  
    : setContent(<><label htmlFor='fileUpload' className={styles.fileUpload}>PDF 업로드</label>
    <input type="file" id='fileUpload' accept=".pdf" className={styles.fileUpload} onChange={(e) => 
    {
        setUploaded(true);
        e.currentTarget.files && window.open(URL.createObjectURL(e.currentTarget.files[0]));
    }}/></>)},[uploaded])

    /** 파일 업로드 시 방 생성 */
    useEffect(() => {if(uploaded) {
        startCapture({video: true, audio: { echoCancellation: true, noiseSuppression: true}}); 
        create();
    }}, [uploaded])

    /** 화면 캡처 시작 */
    async function startCapture(displayMediaOptions : DisplayMediaStreamOptions) {
        if(!videoElem.current) {console.error("Error : 비디오 요소 존재 확인 불가능 "); return;}

        try {
            videoElem.current.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        } catch (err) {
            console.error(`Error : ${err}`);
            alert(`Error : 화면 캡쳐 오류`);
            setUploaded(false);
        }
    }

    /** 화면 캡처 중지 */
    function stopCapture() {
        if(!videoElem.current) return;
        if(!videoElem.current.srcObject) return;

        let tracks = (videoElem.current.srcObject as MediaStream).getTracks();

        tracks.forEach((track) => track.stop());
        videoElem.current.srcObject = null;
        setUploaded(false);
    }

    /** Room 생성 요청 */
    function create() {
        if(!process.env.SESSION_IP) {console.error("Error : Find Session Server IP error"); return;}
        let randomStr = Math.random().toString(36).substring(2, 12);
        fetch(new URL(process.env.SESSION_IP, randomStr), {
            method: 'GET'           
        }).then((v) => v.json().then((c) => room = c))
    }

    return (
        <main className={styles.main}>
            {content}
        </main>
    )
}

interface Room {
    people : [URL],
    population: number
}
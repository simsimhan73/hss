'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  let room : Room;

  /** Room 입장 */
  async function participate(id : string) {
    if(!process.env.SESSION_IP) {console.error("Error : Find Session Server IP error"); return;}
    fetch(new URL(process.env.SESSION_IP, id), {
      method: 'GET'           
  }).then((v) => v.json().then((c) => room = c))
  }

  

  return (
    <main>
      {/** 중앙 화면 */}
      <div className={styles.main}>
        <button type='button' className={styles.generate} onClick={() => router.push("/share")}>방 생성하기</button>  
        <div className={styles.join}>
          <input type='text'></input> {/** 입장 코드 입력 */}
          <button type='button'>입장</button>
        </div>
      </div>
    </main>
  )
}

interface Room {
  people : [URL],
  population: number
}
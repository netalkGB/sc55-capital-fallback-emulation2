import React from 'react'
import type Track from '../../Track.ts'
import styles from './Monitor.module.css'

interface MonitorProps {
  tracks: Track[]
}
export default function Monitor ({ tracks }: MonitorProps): React.ReactNode {
  return (
    <>
      <div className={`${styles.track}`}>
        <div className={styles.number}>
          CH
        </div>
        <div className={`${styles.number} ${styles.bmsb}`}>
          BSMSB
        </div>
        <div className={styles.number}>
          PC
        </div>
        <div className={styles.instrument}>
          NAME
        </div>
      </div>
      {
        tracks.map((track, index) => (
          <div key={index}
               className={`${styles.track} ${(track.bankSelectMSB !== track.emulateBankSelectMSB) ? styles.emulating : ''}`}>
            <div className={styles.number}>
              {track.channel}
            </div>
            <div className={`${styles.number} ${styles.bmsb}`}>
              {((track.bankSelectMSB !== track.emulateBankSelectMSB)) ? (track.bankSelectMSB + ' → ' + track.emulateBankSelectMSB) : track.bankSelectMSB}
            </div>
            <div className={styles.number}>
              {track.programChangeNumber + 1}
            </div>
            <div className={styles.instrument}>
              {track.getEmulatedName()}
            </div>
          </div>
        ))
      }
    </>
  )
}

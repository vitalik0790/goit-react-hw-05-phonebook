import React from 'react'
import Styles from './Empty.module.css'

const Empty = () => {
    return (
        <div className={Styles.NotificationWrapper}>
            {`ALL FIELDS MUST BE FILLED!`}
        </div>
    );
}

export default Empty;
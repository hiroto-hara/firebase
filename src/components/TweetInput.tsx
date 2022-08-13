//lib
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { auth, storage, db } from '../firebase'
//style
import styles from './TweetInput.module.css'
//MUI
import { Avatar, Button, IconButton } from '@material-ui/core'

const TweetInput = () => {
  const user = useSelector(selectUser)
  console.log(user)
  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await auth.signOut()
        }}
      />
    </div>
  )
}

export default TweetInput

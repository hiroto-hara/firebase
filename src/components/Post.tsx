//lib
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import firebase from 'firebase/app'
import { useSelector } from 'react-redux'
//file
import { selectUser } from '../features/userSlice'
//styles
import styles from './Post.module.css'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MessageIcon from '@material-ui/icons/Message'
import SendIcon from '@material-ui/icons/Send'
import { PersonPinSharp } from '@material-ui/icons'

interface PROPS {
  postId: string
  avatar: string
  image: string
  text: string
  timestamp: any
  username: string
}

const Post: React.FC<PROPS> = props => {
  const [comment, setComment] = useState('')
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {}

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={props.avatar} />
      </div>
      <div>
        <div className={styles.post_header}>
          <h3>
            <span className={styles.post_headerUser}>@{props.username}</span>
            <span className={styles.post_headerTime}>
              {props.timestamp
                ? new Date(props.timestamp.toDate()).toLocaleString()
                : 123456789}
            </span>
          </h3>
        </div>
        <div className={styles.post_tweet}>
          <p>{props.text}</p>
        </div>
      </div>
      {props.image && (
        <div className={styles.post_tweetImage}>
          <img src={props.image} alt="tweet" />
        </div>
      )}
    </div>
  )
}

export default Post

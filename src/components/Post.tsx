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
import { makeStyles, styled } from '@material-ui/core/styles'
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

interface COMMENT {
  id: string
  avatar: string
  text: string
  timestamp: any
  username: string
}

const Post: React.FC<PROPS> = props => {
  const user = useSelector(selectUser)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: '',
      avatar: '',
      text: '',
      timestamp: null,
      username: ''
    }
  ])

  //   if (!props.postId) {
  //     console.log('投稿がありません')
  //   } else {
  //     const getComments = db
  //       .collection('posts')
  //       .doc(props.postId)
  //       .collection('comments')
  //       .orderBy('timestamp', 'desc')
  //       .onSnapshot(snapshot =>
  //         setComments(
  //           snapshot.docs.map(doc => ({
  //             id: doc.id,
  //             avatar: doc.data().avatar,
  //             text: doc.data().text,
  //             timestamp: doc.data().timestamp,
  //             username: doc.data().username
  //           }))
  //         )
  //       )
  //     console.log('確認点')
  //     useEffect(() => {
  //       getComments()
  //     }, [props.postId])
  //   }

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    db.collection('posts')
      .doc(props.postId)
      .collection('comments')
      .add({
        avatar: user.photoUrl,
        text: comment,
        timestamp: firebase.firestore.Timestamp.now(),
        username: user.displayName
      })
    setComment('')
  }

  //   const formattedData = () => {
  //     const date = new Date(props.timestamp)
  //     return `${date.getFullYear()}月${date.getMonth() + 1}月${date.getDay()}日`
  //   }
  //   console.log(formattedData())

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
              {props.timestamp &&
                new Date(props.timestamp.toDate()).toLocaleString()}
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

      {comments.map(com => (
        <div key={com.id} className={styles.post_comment}>
          <Avatar src={com.avatar} />
          <span className={styles.post_commentUser}>@{com.username}</span>
          <span className={styles.post_commentText}>{com.text}</span>
          <span className={styles.post_headerTime}>
            {com.timestamp && new Date(com.timestamp.toDate()).toLocaleString()}
          </span>
        </div>
      ))}

      <form onSubmit={newComment}>
        <div className={styles.post_form}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="Add new comment..."
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setComment(e.target.value)
            }
          />
          <button
            disabled={!comment}
            className={comment ? styles.post_button : styles.post_buttonDisable}
            type="submit"
          >
            <SendIcon className={styles.post_sendIcon} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default Post

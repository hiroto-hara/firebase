//lib
import React, { useState, useEffect, useCallback } from 'react'
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

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}))

const Post: React.FC<PROPS> = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const user = useSelector(selectUser)
  const classes = useStyles()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: '',
      avatar: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ])
  const [openComments, setOpenComments] = useState(false)

  const getComments = useCallback(() => {
    if (props.postId) {
      try {
        db.collection('posts')
          .doc(props.postId)
          .collection('comments')
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) =>
            setComments(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                avatar: doc.data().avatar,
                text: doc.data().text,
                timestamp: doc.data().timestamp,
                username: doc.data().username,
              }))
            )
          )
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
  }, [props.postId])

  useEffect(() => {
    getComments()
  }, [props.postId, getComments])

  if (isLoading) return <p>...Loading</p>
  if (isError) return <p>予期せぬエラーです</p>

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    db.collection('posts').doc(props.postId).collection('comments').add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.Timestamp.now(),
      username: user.displayName,
    })
    setComment('')
  }

  const formattedTimestamp = (timestamp: any): string | null => {
    if (!timestamp) return null

    return new Date(timestamp.toDate()).toLocaleString()
  }

  return (
    <div className={styles.post}>
      <div className={styles.post_avatar}>
        <Avatar src={props.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{props.username}</span>
              <span className={styles.post_headerTime}>
                {formattedTimestamp(props.timestamp)}
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
        <MessageIcon
          className={styles.post_commentIcon}
          onClick={() => setOpenComments(!openComments)}
        />
        {openComments && (
          <>
            {comments.map((com) => (
              <div key={com.id} className={styles.post_comment}>
                <Avatar src={com.avatar} className={classes.small} />
                <span className={styles.post_commentUser}>@{com.username}</span>
                <span className={styles.post_commentText}>{com.text}</span>
                <span className={styles.post_headerTime}>
                  {formattedTimestamp(com.timestamp)}
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
                  className={
                    comment ? styles.post_button : styles.post_buttonDisable
                  }
                  type="submit"
                >
                  <SendIcon className={styles.post_sendIcon} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Post

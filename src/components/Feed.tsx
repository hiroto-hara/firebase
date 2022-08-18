//lib
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
//components
import TweetInput from './TweetInput'
import Post from './Post'
//styles
import styles from './Feed.module.css'
import { Unsubscribe } from '@material-ui/icons'

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
      username: ''
    }
  ])
  const getPosts = db
    .collection('posts')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot =>
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          avatar: doc.data().avatar,
          image: doc.data().image,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          username: doc.data().username
        }))
      )
    )

  useEffect(() => {
    getPosts()
  }, [])
  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts.length === 0 ? (
        123456789
      ) : (
        <>
          {posts.map(post => (
            <Post
              key={post.id}
              postId={post.id}
              avatar={post.avatar}
              image={post.image}
              text={post.text}
              timestamp={post.timestamp}
              username={post.username}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default Feed

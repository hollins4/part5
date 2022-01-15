import React, { useState } from 'react'
import './blogstyle.css'


const Blog = ({ blog, updateBlogLikes, deleteBlog, toggleBlogDetails }) => {

  const [ showBlogDetails, setShowBlogDetails ] = useState(false)

  const showWhenVisible = { display:  showBlogDetails ? '' : 'none' }
  const hideWhenVisible = { display:  showBlogDetails ? 'none' : '' }

  const user = blog.user !== null ? blog.user.name : 'Anonymous User'

  const viewHandler = () => {
    setShowBlogDetails(!showBlogDetails)

    if (toggleBlogDetails)
      toggleBlogDetails()
  }

  return(
    <div className="blogStyling">
      {blog.title} {blog.author}
      <span style={hideWhenVisible}><button onClick={viewHandler}>View</button></span>
      <span style={showWhenVisible}><button onClick={viewHandler}>Hide</button></span>
      <div style={showWhenVisible} className="togglableContent">
        <div>{blog.url}</div>
        <div> Likes: <span className='totalLikes'>{blog.likes}</span> <button onClick={() => updateBlogLikes(blog.id)}>like</button></div>
        <div>{user}</div>
        <button className="deleteButton" onClick={() => deleteBlog(blog.id)}>Delete</button>
      </div>
    </div>
  )
}

export default Blog
import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')

  const postBlog = async (event) => {
    event.preventDefault()

    const newPost = {
      title: title,
      url: url,
      author: author
    }

    createBlog(newPost)

    setUrl('')
    setTitle('')
    setAuthor('')
  }

  return (
    <form onSubmit={postBlog}>
      <div>
          Title:
        <input
          type="text"
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
          Author:
        <input
          type="text"
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
          Url:
        <input
          type="text"
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit" id="create-blog">Create</button>
    </form>
  )
}


export default BlogForm
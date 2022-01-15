import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/CreateBlog'
import Notification from './components/Notifications'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs => {

      const sortedBlogs = sortBlogs(blogs)
      setBlogs( sortedBlogs )
    })
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('user')

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'user',  JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {

      setErrorMessage({ message: 'Wrong credentials', status: false })
      setUsername('')
      setPassword('')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const sortBlogs = (blogs) => {
    const sortedBlogs = blogs.sort(function (a, b) {
      return b.likes - a.likes
    })
    return sortedBlogs
  }

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    setUsername('')
    setPassword('')
    blogService.setToken(null)
  }

  const createBlog = async (newPost) => {

    try {
      await blogService.create(newPost)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      //await setBlogs(blogs.concat(returnedBlog))

      await setErrorMessage({ message: `${newPost.title}! by ${newPost.author}`, status: true })
      await setTimeout( () => {
        setErrorMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage({ message: 'Missing either title, url, or author', status: false })

      setTimeout( () => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlogLikes = async (id) => {
    try {
      const post = blogs.find(blog => blog.id === id)

      let likesPlusOne = post.likes + 1
      const updatedBlog = { ...post, likes: likesPlusOne }

      await blogService.update(id, updatedBlog)
      //await setBlogs(blogs.map( blog => blog.id !== id ? blog : updatedBlogLikes))
      const bloglist = await blogService.getAll()
      await setBlogs(sortBlogs(bloglist))

    } catch (error) {
      setErrorMessage({ message: 'Blog was already removed from server', status: false })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    try {

      const blog = blogs.find(blog => blog.id === id)

      let confirm = window.confirm(`Are you sure you want to delete ${blog.title}? `)

      if (!confirm)
        return

      await blogService.deleteBlog(id)
      const bloglist = await blogService.getAll()
      await setBlogs(sortBlogs(bloglist))

      await setErrorMessage({ message: `${blog.title} has been deleted`, status: true })
      await setTimeout( () => {
        setErrorMessage(null)
      }, 5000)

    } catch (error) {
      setErrorMessage({ message: `${error}`, status: false })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="Create New Blog">
      <BlogForm
        createBlog={createBlog}
      />
    </Togglable>
  )


  if (user === null) {
    return (
      <div>
        <h2>Log into Application</h2>
        <Notification info={errorMessage}/>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              input="text"
              id="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              input="text"
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification info={errorMessage}/>
      <div>
        <span>{user.name} is logged in</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <br />
      { blogForm() }
      <br />
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlogLikes={updateBlogLikes}
          deleteBlog={deleteBlog}
        />
      )}

    </div>
  )
}

export default App
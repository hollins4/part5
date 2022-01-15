import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import Togglable from './Togglable'

test('Blog renders blog title and author, but does not render url or likes', () => {

  const blog = {
    title: 'Why are there so many people',
    url: 'www.youtube.com',
    author: 'Jonathan Pink',
    likes: 7,
    user: null
  }

  const component = render(
    <Blog blog={blog} />
  )

  const div = component.container.querySelector('.blogStyling')
  const details = div.querySelector('.togglableContent')

  component.debug()

  expect(div).toHaveTextContent(
    'Why are there so many people',
  )

  expect(component.container).toHaveTextContent(
    'Jonathan Pink'
  )

  expect(details).toHaveStyle(`
    display: none;
  `)

})


test('Blog will show url and likes after show details button is clicked', () => {

  const blog = {
    title: 'Why are there so many people',
    url: 'www.youtube.com',
    author: 'Jonathan Pink',
    likes: 7,
    user: null
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} toggleBlogDetails={mockHandler} />
  )

  const details = component.container.querySelector('.togglableContent')
  
  const button = component.getByText('View')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)

  expect(details).toHaveStyle(`
    display: block;
  `)

})

test('Likes button is clicked twice', () => {

  const blog = {
    title: 'Why are there so many people',
    url: 'www.youtube.com',
    author: 'Jonathan Pink',
    likes: 7,
    user: null
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} updateBlogLikes={mockHandler} />
  )

  const button = component.getByText('Like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})

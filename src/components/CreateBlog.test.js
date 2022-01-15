import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './CreateBlog'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const mockHandler = jest.fn()

  const component = render(
    <BlogForm createBlog={mockHandler} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, { target: { value: 'Test blog' } })
  fireEvent.change(author, { target: { value: 'marty' } })
  fireEvent.change(url, { target: { value: 'www.google.com' } })
  fireEvent.submit(form)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('Test blog' )
  expect(mockHandler.mock.calls[0][0].author).toBe('marty' )
  expect(mockHandler.mock.calls[0][0].url).toBe('www.google.com' )
})
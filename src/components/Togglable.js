import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }

  const toggleVisbility = () => {
    setVisible(!visible)
  }


  return (
    <div>
      <div style={showWhenVisible}>
        { props.children }
        <button onClick={toggleVisbility}>Cancel</button>
      </div>
      <br />
      <div style={hideWhenVisible}>
        <button onClick={toggleVisbility}>{props.buttonLabel}</button>
      </div>
    </div>
  )

}

Togglable.proptype = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
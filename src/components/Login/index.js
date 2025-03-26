import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {usernameInput: '', passwordInput: '', errMsg: '', isErrMsg: false}

  postLoginApiData = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const url = 'https://apis.ccbp.in/login'

    const option = {
      method: 'POST',
      body: JSON.stringify({username: usernameInput, password: passwordInput}),
    }
    const response = await fetch(url, option)
    const data = await response.json()

    console.log(data)
    if (response.ok === true) {
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      this.setState({errMsg: '', isErrMsg: false})
      const {history} = this.props
      history.replace('/')
    } else {
      const errText = data.error_msg
      this.setState({errMsg: errText, isErrMsg: true})
    }
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  renderLoginFormDetail = () => {
    const {usernameInput, passwordInput, errMsg, isErrMsg} = this.state
    const CookiesToken = Cookies.get('jwt_token')
    if (CookiesToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <form className="form-container" onSubmit={this.postLoginApiData}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website logo"
        />
        <label htmlFor="username">USERNAME</label>
        <input
          type="text"
          onChange={this.onChangeUsername}
          placeholder="Username"
          value={usernameInput}
          id="username"
        />
        <label htmlFor="password">PASSWORD</label>
        <input
          onChange={this.onChangePassword}
          type="password"
          placeholder="Password"
          value={passwordInput}
          id="password"
        />

        <button className="login-btn" type="submit">
          Login
        </button>
        {isErrMsg && <p className="err-msg">{errMsg}</p>}
      </form>
    )
  }

  render() {
    return <div className="bg-container">{this.renderLoginFormDetail()}</div>
  }
}

export default Login

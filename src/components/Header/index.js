import './index.css'
import cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'

const Header = props => {
  const onClickLogoutBtn = () => {
    const {history} = props
    cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="nav-container">
      <li>
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
      </li>
      <li className="nave-menu">
        <Link className="link-item" to="/">
          <p>Home</p>
        </Link>
        <Link className="link-item" to="/jobs">
          <p>Jobs</p>
        </Link>
      </li>
      <li>
        <button onClick={onClickLogoutBtn} type="button" className="logout-btn">
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)

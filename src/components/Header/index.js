import {Link, withRouter} from 'react-router-dom'
import {FaHome} from 'react-icons/fa'
import {IoBagHandleOutline} from 'react-icons/io5'
import {AiOutlineLogout} from 'react-icons/ai'
import Cookies from 'js-cookie'
import './index.css'
const Header = props => {
  const {history} = props
  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <div className="nav-bar-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <ul className="links-list">
          <Link to="/" className="nav-link">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>Jobs</li>
          </Link>
        </ul>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
        <ul className="buttons-list">
          <Link to="/">
            <li>
              <FaHome />
            </li>
          </Link>
          <Link to="/jobs">
            <li>
              <IoBagHandleOutline />
            </li>
          </Link>
          <li>
            <button onClick={onLogout}>
              <AiOutlineLogout />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
export default withRouter(Header)

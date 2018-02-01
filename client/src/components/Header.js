import React, {Component} from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component{

  render(){
    const {user} = this.props

    let content
    switch (user){
      case false:
        content = (<li><a href="/auth/google">Login with Google</a></li>)
        break
      case null:
        content = (
          <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        )
        break
      default:
        content = (<li><a href="/api/logout">Logout</a></li>)
        break
    }

    return(
      <nav>
        <div className="nav-wrapper">
          <Link to={ user ? '/dashboard' : '/'} className="left brand-logo">
             App
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {content}
          </ul>
        </div>
      </nav>
    )
  }
}

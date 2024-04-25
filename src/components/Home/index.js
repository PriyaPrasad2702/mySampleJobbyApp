import Header from '../Header'

import {Link} from 'react-router-dom'

import './index.css'
const Home = props => {
  const redirectToJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <>
      <Header />
      <div className="bg-container">
        <div className="home-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-desc">
            Millions of people are searching for jobs, salary inforamtion,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button className="home-btn" onClick={redirectToJobs}>
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Home

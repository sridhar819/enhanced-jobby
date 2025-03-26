import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstant = {
  success: 'success',
  failure: 'failure',
  loading: 'loading',
}

class JobItemDetails extends Component {
  state = {JobItemDetailObject: {}, apiStatus: apiStatusConstant.loading}

  componentDidMount() {
    this.jobItemDetailApi()
  }

  jobItemDetailApi = async () => {
    this.setState({apiStatus: apiStatusConstant.loading})
    const {match} = this.props

    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')

    const api = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(api, {
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`},
    })

    const data = await response.json()

    if (response.ok === true) {
      const formatData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          title: data.job_details.title,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: data.job_details.skills.map(each => ({
            imageUrl: each.image_url,
            name: each.name,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
        },
        similarJobs: data.similar_jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          rating: job.rating,
          title: job.title,
        })),
      }

      this.setState({
        JobItemDetailObject: formatData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderLodingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="blue" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {JobItemDetailObject} = this.state
    const {jobDetails, similarJobs} = JobItemDetailObject
    const {lifeAtCompany} = jobDetails
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="bg-container-detial">
        <div className="detail-card">
          <div className="detail-card-title-section ">
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="title">{jobDetails.title}</h1>
              <p className="rating">🤩{jobDetails.rating}</p>
            </div>
          </div>
          <div className="location-info">
            <div className="location-info-right">
              <p>🏢{jobDetails.location}</p>
              <p>⌛{jobDetails.employmentType}</p>
            </div>
            <p>💲{jobDetails.packagePerAnnum}</p>
          </div>
          <hr />

          <div className="description-link-card-section">
            <h1>Description</h1>
            <button className="link-btn" type="button">
              <a href={jobDetails.companyWebsiteUrl}>Visit🌍</a>
            </button>
          </div>
          <p>{jobDetails.jobDescription}</p>

          <h1>Skills</h1>
          <ul className="skills-container">
            {jobDetails.skills.map(each => (
              <li key={each.name}>
                <div className="skills-info">
                  <img src={each.imageUrl} alt={each.name} />
                  <h1>{each.name}</h1>
                </div>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="life-company-container">
            <p>{description}</p>
            <img src={imageUrl} alt="life at company" />
          </div>
          <h1>Similar Jobs</h1>
          <ul className="similar-job-container">
            {similarJobs.map(each => (
              <li key={each.id}>
                <div className="similar-card">
                  <div className="similar-title-section">
                    <img
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                    />
                    <div>
                      <h1 className="title">{each.title}</h1>
                      <p className="rating">⭐{each.rating}</p>
                    </div>
                  </div>
                  <h1>Description</h1>
                  <p>{each.jobDescription}</p>
                  <div className="location-info">
                    <p>🏢{each.location}</p>
                    <p>⌛{each.employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickRetry = () => {
    this.setState({apiStatus: apiStatusConstant.loading}, this.jobItemDetailApi)
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.onClickRetry} className="retry-btn" type="button">
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstant.loading:
        return this.renderLodingView()
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobItemDetails()}
      </>
    )
  }
}

export default JobItemDetails

import './index.css'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstant = {
  success: 'success',
  failure: 'failure',
  loading: 'loading',
}

const profileStatusConstant = {
  success: 'success',
  failure: 'failure',
  loading: 'loading',
}

class Jobs extends Component {
  state = {
    profileData: {},
    employmentType: [],
    lpaRange: '',
    searchInput: '',
    jobDataList: [],
    apiStatus: apiStatusConstant.loading,
    profileStatus: profileStatusConstant.loading,
  }

  componentDidMount() {
    this.profileFetchApiData()
    this.jobFetchData()
  }

  profileFetchApiData = async () => {
    this.setState({profileStatus: profileStatusConstant.loading})
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('https://apis.ccbp.in/profile', {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    })
    const data = await response.json()

    if (response.ok) {
      const formatData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: formatData,
        profileStatus: profileStatusConstant.success,
      })
    } else {
      this.setState({profileStatus: profileStatusConstant.failure})
    }
  }

  jobFetchData = async () => {
    this.setState({apiStatus: apiStatusConstant.loading})
    const {searchInput, lpaRange, employmentType} = this.state
    const workType = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${workType}&minimum_package=${lpaRange}&search=${searchInput}`,
      {method: 'GET', headers: {Authorization: `Bearer ${jwtToken}`}},
    )
    const data = await response.json()

    if (response.ok === true) {
      const formatData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobDataList: formatData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  renderProfileSection = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <>
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </div>
        <hr />
      </>
    )
  }

  onChangeEmployment = event => {
    const {id, checked} = event.target
    this.setState(
      preState => ({
        employmentType: checked
          ? [...preState.employmentType, id]
          : preState.employmentType.filter(each => each !== id),
      }),
      this.jobFetchData,
    )
  }

  onChangeUpdateLpa = event => {
    this.setState({lpaRange: event.target.value}, this.jobFetchData)
  }

  renderFilterOptionSection = () => (
    <>
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="emploment-option-container">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId}>
            <input
              onChange={this.onChangeEmployment}
              id={each.employmentTypeId}
              type="checkbox"
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>

      <hr />
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="salary-option-container">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              onChange={this.onChangeUpdateLpa}
              name="group"
              id={each.salaryRangeId}
              type="radio"
              value={each.salaryRangeId}
            />
            <label name="group" htmlFor={each.salaryRangeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onclickSearchIcon = () => {
    this.jobFetchData()
  }

  renderJobData = () => {
    const {jobDataList} = this.state
    return jobDataList.length > 0 ? (
      <ul>
        {jobDataList.map(each => (
          <JobItem key={each.id} jobDataItem={each} />
        ))}
      </ul>
    ) : (
      <div className="no-item-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-item"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  onClickRetry = () => {
    this.setState({apiStatus: apiStatusConstant.loading}, this.jobFetchData)
  }

  renderfailureView = () => (
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

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="blue" height="50" width="50" />
    </div>
  )

  renderStatusUpdate = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.loading:
        return this.renderLoadingView()
      case apiStatusConstant.success:
        return this.renderJobData()
      case apiStatusConstant.failure:
        return this.renderfailureView()
      default:
        return null
    }
  }

  profileRetry = () => {
    this.setState(
      {profileStatus: profileStatusConstant.loading},
      this.profileFetchApiData,
    )
  }

  renderFailueProfile = () => (
    <div className="profile-error">
      <button type="button" onClick={this.profileRetry} className="retry-btn">
        Retry
      </button>
    </div>
  )

  renderSwitchCaseApiStatus = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileStatusConstant.loading:
        return this.renderLoadingView()
      case profileStatusConstant.success:
        return this.renderProfileSection()
      case profileStatusConstant.failure:
        return this.renderFailueProfile()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-container">
          <div className="Filter-profile-container">
            {this.renderSwitchCaseApiStatus()}
            {this.renderFilterOptionSection()}
          </div>
          <div className="job-card-container">
            <div className="search-input-container">
              <input type="search" onChange={this.onChangeInput} />

              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onclickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderStatusUpdate()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

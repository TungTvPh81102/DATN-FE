export const RatingForm = () => {
  return (
    <div className="add-review-wrap">
      <div className="add-review-title text-22 fw-5">Leave A Reply</div>
      <p className="fs-15">
        Your email address will not be published.&nbsp;Required fields are
        marked&nbsp;*
      </p>
      <div className="ratings">
        <h6 className="fw-5">Ratings</h6>
        <i className="icon-star-1" />
        <i className="icon-star-1" />
        <i className="icon-star-1" />
        <i className="icon-star-1" />
        <svg
          width={12}
          height={11}
          viewBox="0 0 12 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.54831 7.10382L3.58894 6.85477L3.41273 6.67416L1.16841 4.37373L4.24914 3.90314L4.51288 3.86286L4.62625 3.62134L5.99989 0.694982L7.37398 3.62182L7.48735 3.86332L7.75108 3.9036L10.8318 4.37419L8.58749 6.67462L8.41128 6.85523L8.4519 7.10428L8.98079 10.3465L6.24201 8.8325L6.00014 8.69879L5.75826 8.83247L3.01941 10.3461L3.54831 7.10382ZM11.0444 4.15626L11.0442 4.15651L11.0444 4.15626Z"
            stroke="#131836"
          />
        </svg>
      </div>
      <form action="#" className="form-add-review">
        <div className="cols">
          <fieldset className="tf-field">
            <input
              className="tf-input style-1"
              id="field1"
              type="text"
              placeholder=""
              name="text"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
            />
            <label className="tf-field-label fs-15" htmlFor="field1">
              First Name
            </label>
          </fieldset>
          <fieldset className="tf-field">
            <input
              className="tf-input style-1"
              id="field2"
              type="email"
              placeholder=""
              name="email"
              tabIndex={2}
              defaultValue="creativelayers088@gmail.com"
              aria-required="true"
            />
            <label className="tf-field-label fs-15" htmlFor="field2">
              Email
            </label>
          </fieldset>
        </div>
        <div className="cols">
          <fieldset className="tf-field">
            <input
              className="tf-input style-1"
              id="field3"
              type="number"
              placeholder=""
              name="number"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
            />
            <label className="tf-field-label fs-15" htmlFor="field3">
              Phone
            </label>
          </fieldset>
          <fieldset className="tf-field">
            <input
              className="tf-input style-1"
              id="field4"
              type="email"
              placeholder=""
              name="email"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
            />
            <label className="tf-field-label fs-15" htmlFor="field4">
              Title
            </label>
          </fieldset>
        </div>
        <fieldset className="tf-field">
          <textarea
            className="tf-input style-1"
            name="message"
            rows={4}
            placeholder=""
            tabIndex={2}
            aria-required="true"
            defaultValue={''}
          />
          <label className="tf-field-label type-textarea fs-15" htmlFor="">
            Textarea
          </label>
        </fieldset>
        <div className="checkbox-item">
          <label>
            <p className="fs-15">
              Save my name, email, and website in this browser for the next time
              I comment.
            </p>
            <input type="checkbox" />
            <span className="btn-checkbox" />
          </label>
        </div>
        <div className="button-submit">
          <button className="tf-btn w-100" type="submit">
            Post Comment
            <i className="icon-arrow-top-right" />
          </button>
        </div>
      </form>
    </div>
  )
}

import { assets } from "../../assets/assets"
function AddDoctor() {
  return (
    <form>
      <p>Add Doctor</p>
          <div>
            <div>
              <label htmlFor="doc-img">
                <img src={assets.upload_area} alt="" />
              </label>

              <input type="file" id="doc-img" hidden />

              <p>
                Upload doctor <br /> picture
              </p>
            </div>

            <div>
              <div>
                <div>
                  <p>Your name</p>
                  <input type="text" placeholder="Name" required />
                </div>
              </div>
            </div>
        </div>
    </form>
  )
}

export default AddDoctor

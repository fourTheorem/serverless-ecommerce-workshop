import logo from '../images/logo.svg'

function Footer() {
  return <footer className="footer" style={{ margin: "4em 0 0 0" }}>
    <div className="container">
      <p><img src={logo} style={{ height: "1.8em" }} /></p>
      <div className="columns">
        <div className="column is-3">
          <div className="content">
            <p>
              <strong>TimelessMusic</strong> by <a href="https://fourtheorem.com">fourTheorem</a>.<br />
              <small>A sample application for learning Serverless on AWS.</small>
            </p>
          </div>
        </div>
        <div className="column is-3">
          <div className="content">
            <p>
              <small>The <a href="https://github.com/fourTheorem/serverless-ecommerce-workshop">source code</a> is licensed under
                <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
                is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.</small>
            </p>
          </div>
        </div>
        <div className="column is-3">
          <div className="content">
            <small>
              Built with <a href="http://bulma.io" target="_blank">Bulma</a>, <a href="https://reactjs.org/" target="_blank">React</a> &amp; other Open Source technologies.
            </small>
          </div>
        </div>
        <div className="column is-3">
          <div className="content">
            <small>
              When time travel will be generally available, remember to thank <a href="https://fourtheorem.com" target="_blank">fourTheorem</a> for making you rich with this awesome idea! ❤︎
            </small>
          </div>
        </div>
      </div>
    </div>
  </footer>
}

export default Footer
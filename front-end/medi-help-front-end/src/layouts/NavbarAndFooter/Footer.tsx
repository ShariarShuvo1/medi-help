export const Footer = () => {
  return (
    <section>
      <div className="container d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <div className="lc-block text-center mb-3 mb-md-0">
            <a className="navbar-brand" href="https://library.livecanvas.com/sections/">
              <img className="img-fluid me-1" src={require("./../../images/App-logos/medi-help-logo-white-bg.png")} alt="my brand" width="48px" height="48px" />
            </a>

            <span className="text-muted">© 2023 MediHelp, Inc</span>

          </div>
        </div>


        <div className="col-md-4 justify-content-end d-flex gap-3">
          <div className="lc-block">

            <a href="https://github.com/ShariarShuvo1/medi-help" target="-blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}



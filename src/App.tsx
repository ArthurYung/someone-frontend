import './App.scss'

const GlitchText = () => <>
SOME
<span>
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACJUlEQVR4Ac3XA4ycQRjG8dq2bSuobRthbduNatu2bStObRvh2ff2X89N5ttZnJL8loMnu8MkIuKTSxWr1MJRJPOmvi8dJ8UQvEYkrqJhvASgo5a4DzHYh+JxEoCGS+AAxCIYM5Da9wCgoTSYhVCI5g22IgqieYHOPgWgga54CdFEYj4y/ilXEWcgBqdR0aMAVKiMsxCDUyjvUK8LXkA0UViIzC4DUCALFiMaonmGToY6zZBReZ8aMxEM0XxEL6SKEYAP8mMgPkE0HzARqbWOK+I4BJMdBu1+iMF7PUArPIQYHEMKpWw2LNEGXgByOfwtzXEXolIDqIvLOPhDNN/RF33wBaIJRU4XYyoZXjsG0AoXwi6IjTJWrrkxox7ZA+g/nfOK9wlXlADT3AjwxBrAUCk5JiFQqbwdWbBGmWLNUBL5fA9grlwU69BS+eyDsih9U8bCaRT3LYA9UEWIC9+Qx+MAfFEDDf4o5iJAX4giBIEQxRZvArxRCi13ESA/whGBUciDHNii1PdHRk8DqIvRAsvfMBxNtc8yIkRpo2zcBHAOVRLhEEQgjy8B5njYeQXcU+pfsSxE1gDrLB3WxRpswHVtB41GNY+XYr54qu3he1HUIcAAiEEoOpk3I3uA2xBNEKYjjVa2v6HjQyhp247xzilAdtuBRBtwozAM7ZBf+c6jA4kpSCXLkayCQ73OtiNZIjqUJv5jue8Xk0R+NUv8l9O4v57/AJf9w786IH4hAAAAAElFTkSuQmCC" alt="" />
</span>
NE
</>

function App() {
  return (
    <div className="loading-page">
      <main>
        <div className="loading-page-glitch">
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
          <div className="loading-page-line">
            <GlitchText />
          </div>
        </div>
        <p className='loading-page-text'>LOADING...</p>
      </main>
    </div>
  )
}

export default App

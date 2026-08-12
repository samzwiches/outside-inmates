export default function Home() {
  return (
    <main className="coming-soon-shell">
      <div className="coming-soon-glow coming-soon-glow-one" aria-hidden="true" />
      <div className="coming-soon-glow coming-soon-glow-two" aria-hidden="true" />

      <section className="coming-soon-card" aria-labelledby="coming-soon-title">
        <header className="coming-soon-brand">
          <div className="coming-soon-mark" aria-hidden="true">
            <span>OI</span>
          </div>
          <div>
            <p className="coming-soon-name">Outside Inmates</p>
            <p className="coming-soon-kicker">A clearer way through incarceration and reentry</p>
          </div>
        </header>

        <div className="coming-soon-content">
          <div className="coming-soon-copy">
            <p className="coming-soon-eyebrow">We are building something that matters</p>
            <h1 id="coming-soon-title">Coming soon.</h1>
            <p className="coming-soon-lede">
              Outside Inmates is being built for the people who are too often handed a maze and told to figure it out alone.
              Families, loved ones, and people coming home deserve practical information that is easier to find, easier to understand,
              and grounded in dignity.
            </p>
            <p className="coming-soon-note">
              The full site is still under construction while we verify resources, build state by state information, and shape tools that can actually help when the system gets complicated.
            </p>
          </div>

          <aside className="coming-soon-preview" aria-label="What is ahead">
            <p className="coming-soon-preview-label">What is ahead</p>
            <div className="coming-soon-preview-item">
              <span className="coming-soon-number">01</span>
              <div>
                <h2>Find the right place to start</h2>
                <p>Guided paths for arrest, incarceration, family support, release, and rebuilding.</p>
              </div>
            </div>
            <div className="coming-soon-preview-item">
              <span className="coming-soon-number">02</span>
              <div>
                <h2>Useful information, closer to home</h2>
                <p>State and local resources, court and facility information, reentry support, and practical next steps.</p>
              </div>
            </div>
            <div className="coming-soon-preview-item">
              <span className="coming-soon-number">03</span>
              <div>
                <h2>Support for the people outside, too</h2>
                <p>Family guidance, children and teens, visitation, communication, and the parts nobody hands you a manual for.</p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="coming-soon-footer">
          <p>Thoughtfully built. Carefully verified. Opening when it is ready.</p>
          <span aria-hidden="true">outsideinmates.com</span>
        </footer>
      </section>

      <style>{`
        .coming-soon-shell {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: clamp(24px, 5vw, 72px);
          background:
            radial-gradient(circle at 12% 18%, rgba(166, 95, 77, 0.17), transparent 34%),
            radial-gradient(circle at 88% 84%, rgba(135, 153, 138, 0.16), transparent 38%),
            #18242b;
          color: #f3eee6;
        }

        .coming-soon-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image: radial-gradient(rgba(243, 238, 230, 0.32) 0.6px, transparent 0.6px);
          background-size: 8px 8px;
        }

        .coming-soon-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(4px);
          pointer-events: none;
        }

        .coming-soon-glow-one {
          width: 310px;
          height: 310px;
          top: -170px;
          right: 8%;
          border: 1px solid rgba(243, 238, 230, 0.11);
        }

        .coming-soon-glow-two {
          width: 460px;
          height: 460px;
          bottom: -310px;
          left: -120px;
          border: 1px solid rgba(243, 238, 230, 0.08);
        }

        .coming-soon-card {
          position: relative;
          z-index: 1;
          width: min(1180px, 100%);
          border: 1px solid rgba(243, 238, 230, 0.16);
          border-radius: 24px;
          background: rgba(252, 250, 246, 0.055);
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .coming-soon-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px clamp(24px, 4vw, 48px);
          border-bottom: 1px solid rgba(243, 238, 230, 0.12);
        }

        .coming-soon-mark {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border: 1px solid rgba(243, 238, 230, 0.33);
          border-radius: 14px 14px 14px 5px;
          font-family: var(--serif);
          font-size: 1.05rem;
          letter-spacing: -0.05em;
        }

        .coming-soon-name {
          margin: 0;
          font-family: var(--serif);
          font-size: 1.34rem;
          line-height: 1;
          letter-spacing: -0.035em;
        }

        .coming-soon-kicker {
          margin: 5px 0 0;
          color: rgba(243, 238, 230, 0.56);
          font-size: 0.68rem;
          letter-spacing: 0.02em;
        }

        .coming-soon-content {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
          gap: clamp(48px, 8vw, 108px);
          padding: clamp(50px, 8vw, 104px) clamp(24px, 6vw, 78px);
        }

        .coming-soon-copy {
          align-self: center;
        }

        .coming-soon-eyebrow,
        .coming-soon-preview-label {
          margin: 0 0 18px;
          color: #d6ad9f;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .coming-soon-copy h1 {
          max-width: none;
          margin: 0 0 28px;
          color: #fcfaf6;
          font-family: var(--serif);
          font-size: clamp(4.7rem, 10vw, 8.8rem);
          line-height: 0.82;
          letter-spacing: -0.065em;
        }

        .coming-soon-lede {
          max-width: 650px;
          margin: 0;
          color: rgba(243, 238, 230, 0.9);
          font-size: clamp(1.02rem, 1.8vw, 1.2rem);
          line-height: 1.75;
        }

        .coming-soon-note {
          max-width: 620px;
          margin: 25px 0 0;
          padding-top: 24px;
          border-top: 1px solid rgba(243, 238, 230, 0.14);
          color: rgba(243, 238, 230, 0.58);
          font-size: 0.82rem;
          line-height: 1.75;
        }

        .coming-soon-preview {
          align-self: stretch;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(26px, 4vw, 42px);
          border: 1px solid rgba(243, 238, 230, 0.13);
          border-radius: 18px;
          background: rgba(24, 36, 43, 0.31);
        }

        .coming-soon-preview-label {
          color: #aebdb0;
          margin-bottom: 8px;
        }

        .coming-soon-preview-item {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 16px;
          padding: 23px 0;
          border-bottom: 1px solid rgba(243, 238, 230, 0.11);
        }

        .coming-soon-preview-item:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .coming-soon-number {
          padding-top: 2px;
          color: rgba(243, 238, 230, 0.35);
          font-family: var(--serif);
          font-size: 0.9rem;
        }

        .coming-soon-preview-item h2 {
          margin: 0 0 8px;
          color: #fcfaf6;
          font-family: var(--serif);
          font-size: 1.55rem;
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .coming-soon-preview-item p {
          margin: 0;
          color: rgba(243, 238, 230, 0.58);
          font-size: 0.76rem;
          line-height: 1.65;
        }

        .coming-soon-footer {
          min-height: 66px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 18px clamp(24px, 4vw, 48px);
          border-top: 1px solid rgba(243, 238, 230, 0.12);
          color: rgba(243, 238, 230, 0.47);
          font-size: 0.68rem;
        }

        .coming-soon-footer p {
          margin: 0;
        }

        .coming-soon-footer span {
          color: rgba(243, 238, 230, 0.68);
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        @media (max-width: 860px) {
          .coming-soon-shell {
            place-items: start center;
            padding: 18px;
          }

          .coming-soon-content {
            grid-template-columns: 1fr;
            gap: 44px;
          }

          .coming-soon-copy h1 {
            font-size: clamp(4rem, 21vw, 7rem);
          }
        }

        @media (max-width: 560px) {
          .coming-soon-brand {
            align-items: flex-start;
          }

          .coming-soon-kicker {
            max-width: 210px;
            line-height: 1.45;
          }

          .coming-soon-content {
            padding-top: 48px;
            padding-bottom: 48px;
          }

          .coming-soon-preview {
            padding: 24px;
          }

          .coming-soon-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }
        }
      `}</style>
    </main>
  );
}

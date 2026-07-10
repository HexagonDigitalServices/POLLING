 const { forgotPassword, verifyResetOtp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const titles = ["Reset your password", "Check your inbox", "New password"];
  const subtitles = [
    "Enter your email and we'll send you a reset code.",
    "Enter the 6-digit code we sent to your email.",
    "Choose a strong password for your account.",
  ];


      <div className={s.stepContainer}>
        {[1, 2, 3].map((sNum) => (
          <div
            key={sNum}
            className={`${s.stepItemWrapper} ${sNum < 3 ? "flex-1" : ""}`}
          >
            <div
              className={`${s.stepCircleBase} ${
                sNum < step
                  ? s.stepCircleDone
                  : sNum === step
                    ? s.stepCircleActive
                    : s.stepCircleInactive
              }`}
            >
              {sNum < step ? "✓" : sNum}
            </div>
            {sNum < 3 && (
              <div
                className={`${s.stepLineBase} ${
                  sNum < step ? s.stepLineDone : s.stepLineInactive
                }`}
              />
            )}
          </div>
        ))}
      </div>


          
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Sending code…
                </>
              


      {step === 2 && (
        <OtpStep
          email={email}
          onSubmit={verify}
          onResend={() => forgotPassword(email)}
          submitText="Verify code →"
        />
      )}

      {/* Step 3 — New password */}
      {step === 3 && (
        <form onSubmit={reset} className={s.newPasswordForm}>
          <div className={s.passwordInputWrapper}>
            <label className={s.label}>New password</label>
            <div className={s.passwordInputWithToggle}>
              <input
                className={`${authInputCls} ${s.passwordInput}`}
                type={showPw ? "text" : "password"}
                minLength={8}
                required
                placeholder="Min. 8 characters"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className={s.toggleButton}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className={s.passwordInputWrapper}>
            <label className={s.label}>Confirm password</label>
            <div className={s.passwordInputWithToggle}>
              <input
                className={`${authInputCls} ${
                  pw2 && pw2 === pw
                    ? s.confirmInputValid
                    : pw2
                      ? s.confirmInputInvalid
                      : ""
                }`}
                type={showPw ? "text" : "password"}
                minLength={8}
                required
                placeholder="Re-enter password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />
              {pw2 && (
                <span
                  className={`${s.confirmFeedback} ${
                    pw2 === pw ? s.confirmFeedbackValid : s.confirmFeedbackInvalid
                  }`}
                >
                  {pw2 === pw ? "✓" : "✗"}
                </span>
              )}
            </div>
          </div>
          <div className="pt-1">
            <AuthButton disabled={busy || pw !== pw2}>
              {busy ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Resetting…
                </>
              ) : (
                "Reset password →"
              )}
            </AuthButton>
          </div>
        </form>
      )}

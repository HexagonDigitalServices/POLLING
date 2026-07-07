  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);


          {form.password.length > 0 && (
            <div className={s.strengthContainer}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`${s.strengthBarBase} ${
                    form.password.length >= i * 3
                      ? i <= 1
                        ? s.strengthWeak
                        : i <= 2
                          ? s.strengthMedium
                          : i <= 3
                            ? s.strengthStrong
                            : s.strengthVeryStrong
                      : s.strengthInactive
                  }`}
                />
              ))}
            </div>
          )}
     
        <div className="pt-1">
          <AuthButton disabled={busy}>
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
                Creating account…
              </>
            ) : (
              "Create account →"
            )}
          </AuthButton>
        </div>
     
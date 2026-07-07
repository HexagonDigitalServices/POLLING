const Label = ({ children }) => <span className={s.label}>{children}</span>;

const Section = ({ title, children }) => (
  <div className={s.section}>
    <h2 className={s.sectionTitle}>{title}</h2>
    {children}
  </div>
);


function PwField(props) {
  const [show, setShow] = useState(false);
  return (
    <div className={s.pwWrapper}>
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`${inputCls} ${s.pwInput}`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className={s.pwToggle}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}


  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [busy, setBusy] = useState("");

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Run an async action, show a toast on success/failure.
  const run = (key, fn, ok) => async (e) => {
    e.preventDefault();
    setBusy(key);
    try {
      await fn();
      toast(ok);
    } catch (e2) {
      toast(e2.response?.data?.message || "Something went wrong", "error");
    } finally {
      setBusy("");
    }
  };

  const saveProfile = run(
    "profile",
    async () => {
      const fd = new FormData();
      fd.append("name", profile.name);
      fd.append("username", profile.username);
      fd.append("bio", profile.bio);
      if (image) fd.append("image", image);
      await updateProfile(fd);
    },
    "Profile updated!",
  );

  const savePassword = run(
    "password",
    async () => {
      await changePassword(pw);
      setPw({ currentPassword: "", newPassword: "" });
    },
    "Password updated!",
  );

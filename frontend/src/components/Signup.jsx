import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = ({ onSignupSuccess = null }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:4000";

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";
    
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitError("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      const payload = { name, email: email.toLowerCase(), password };
      const resp = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setSubmitError(data.message || "Registration failed");
      } else {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("currentUser", JSON.stringify(data.user));
        }
        
        window.dispatchEvent(new CustomEvent("authChanged", { detail: { user: data.user } }));
        if (onSignupSuccess) onSignupSuccess(data.user);
        navigate("/");
      }
    } catch (err) {
      setSubmitError("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      {/* Back Button */}
      <Link to="/" className={signupStyles.backButton}>
        <ArrowLeft className={signupStyles.backButtonIcon} />
        <span className={signupStyles.backButtonText}>Home</span>
      </Link>

      <div className={signupStyles.formContainer}>
        <div className={signupStyles.animatedBorder}>
          <div className={signupStyles.formContent}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Heading */}
              <h2 className={signupStyles.heading}>
                <span className={signupStyles.headingIcon}>
                  <CheckCircle className={signupStyles.headingIconInner} />
                </span>
                <span className={signupStyles.headingText}>Create Account</span>
              </h2>

              <p className={signupStyles.subtitle}>
                Join StudyNP Quiz to track your progress and master new technologies with ease.
              </p>

              {/* Name Field */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>Full Name</span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <User className={signupStyles.inputIconInner} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors(prev => ({...prev, name: undefined}));
                    }}
                    className={`${signupStyles.input} ${errors.name ? signupStyles.inputError : signupStyles.inputNormal}`}
                  />
                </div>
                {errors.name && <p className={signupStyles.errorText}>{errors.name}</p>}
              </label>

              {/* Email Field */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>Email</span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <Mail className={signupStyles.inputIconInner} />
                  </span>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({...prev, email: undefined}));
                    }}
                    className={`${signupStyles.input} ${errors.email ? signupStyles.inputError : signupStyles.inputNormal}`}
                  />
                </div>
                {errors.email && <p className={signupStyles.errorText}>{errors.email}</p>}
              </label>

              {/* Password Field */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>Password</span>
                <div className={signupStyles.inputContainer}>
                  <span className={signupStyles.inputIcon}>
                    <Lock className={signupStyles.inputIconInner} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({...prev, password: undefined}));
                    }}
                    className={`${signupStyles.input} ${signupStyles.passwordInput} ${errors.password ? signupStyles.inputError : signupStyles.inputNormal}`}
                  />
                  <button
                    type="button"
                    className={signupStyles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className={signupStyles.passwordToggleIcon} /> : <Eye className={signupStyles.passwordToggleIcon} />}
                  </button>
                </div>
                {errors.password && <p className={signupStyles.errorText}>{errors.password}</p>}
              </label>

              {submitError && <p className={signupStyles.submitError}>{submitError}</p>}

              {/* Submit Button */}
              <div className={signupStyles.buttonsContainer}>
                <button type="submit" disabled={loading} className={signupStyles.submitButton}>
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>

              {/* Login Prompt */}
              <div className={signupStyles.loginPromptContainer}>
                <div className={signupStyles.loginPromptContent}>
                  <span className={signupStyles.loginPromptText}>Already have an account?</span>
                  <Link to="/login" className={signupStyles.loginPromptLink}>
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{signupStyles.animations}</style>
    </div>
  );
};

export default Signup;
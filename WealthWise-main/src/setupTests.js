// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Comprehensive email validation
  const validateEmail = useCallback((email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email);
  }, []);

  // Enhanced password validation
  const validatePassword = useCallback((password) => {
    const validations = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    return validations;
  }, []);

  // Handle input changes with comprehensive validation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validation (for signup)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin) {
      const passwordValidation = validatePassword(formData.password);
      
      const passwordErrors = [];
      if (!passwordValidation.hasMinLength) passwordErrors.push('At least 8 characters');
      if (!passwordValidation.hasUpperCase) passwordErrors.push('One uppercase letter');
      if (!passwordValidation.hasLowerCase) passwordErrors.push('One lowercase letter');
      if (!passwordValidation.hasNumber) passwordErrors.push('One number');
      if (!passwordValidation.hasSpecialChar) passwordErrors.push('One special character');

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain: ${passwordErrors.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isLogin, validateEmail, validatePassword]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setServerError(null);
    
    // Reset previous errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Placeholder for actual authentication logic
      if (isLogin) {
        // Login logic
        console.log('Login attempt:', formData.email);
      } else {
        // Signup logic
        console.log('Signup attempt:', formData);
      }
    } catch (error) {
      setServerError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isLogin, validateForm]);

  // Google Sign-In with error handling
  const signInWithGoogle = useCallback(async () => {
    setServerError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
    } catch (error) {
      setServerError(error.message || 'Google Sign-In failed');
      console.error("Error during Google Sign-In:", error);
    }
  }, []);



<div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md p-6">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Enter your name"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
                </p>
              )}
            </div>
          )}

          

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="Enter your password"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" /> {errors.password}
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder="Confirm your password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isSubmitting}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="text-center mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setServerError(null);
            }}
            className="text-purple-600 hover:text-purple-700 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
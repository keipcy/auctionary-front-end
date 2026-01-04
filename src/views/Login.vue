<template>
    <div class="login-page">
        <header class="top-bar">
            <div class="brand" @click="$router.push('/')">Booktionary</div>
        </header>
        <div class="login-card">
            <h1>{{ isSignup ? 'Create Account' : 'Welcome Back' }}</h1>
            <p class="subtitle">{{ isSignup ? 'Join Booktionary today' : 'Log in to continue' }}</p>

            <form @submit.prevent="handleSubmit">
                <div v-if="isSignup" class="form-row">
                    <div class="form-group">
                        <label for="firstname">First Name</label>
                        <input
                            id="firstname"
                            type="text"
                            v-model="firstname"
                            placeholder="John"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="lastname">Last Name</label>
                        <input
                            id="lastname"
                            type="text"
                            v-model="lastname"
                            placeholder="Doe"
                            required
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        v-model="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        v-model="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <div v-if="isSignup" class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        v-model="confirmPassword"
                        placeholder="Re-enter your password"
                        required
                    />
                </div>

                <div v-if="error" class="error-message">{{ error }}</div>

                <button type="submit" class="submit-btn">
                    {{ isSignup ? 'Sign Up' : 'Log In' }}
                </button>
            </form>

            <div class="toggle-mode">
                <span v-if="!isSignup">
                    Don't have an account?
                    <a href="#" @click.prevent="isSignup = true">Sign up</a>
                </span>
                <span v-else>
                    Already have an account?
                    <a href="#" @click.prevent="isSignup = false">Log in</a>
                </span>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Footer from '../components/Footer.vue';
export default {
    name: 'Login',
    components: {
        Footer
    },
    data() {
        return {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: '',
            isSignup: false
        };
    },
    methods: {
        handleSubmit() {
            this.error = '';

            // Basic validation
            if (this.isSignup && (!this.firstname || !this.lastname)) {
                this.error = 'Please fill in all fields';
                return;
            }

            if (!this.email || !this.password) {
                this.error = 'Please fill in all fields';
                return;
            }

            // Name validation for signup
            if (this.isSignup) {
                if (this.firstname.trim().length < 2) {
                    this.error = 'First name must be at least 2 characters';
                    return;
                }
                if (this.lastname.trim().length < 2) {
                    this.error = 'Last name must be at least 2 characters';
                    return;
                }
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                this.error = 'Please enter a valid email';
                return;
            }

            // Password validation
            if (this.password.length < 6) {
                this.error = 'Password must be at least 6 characters';
                return;
            }

            // Signup-specific validation
            if (this.isSignup) {
                if (this.password !== this.confirmPassword) {
                    this.error = 'Passwords do not match';
                    return;
                }
                
                // Call signup API
                this.signup();
            } else {
                // Call login API
                this.login();
            }
        },
        
        signup() {
            fetch('http://localhost:3333/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: this.firstname,
                    last_name: this.lastname,
                    email: this.email,
                    password: this.password
                })
            })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error_message || 'Signup failed');
                    });
                }
            })
            .then(data => {
                // After successful signup, log in automatically
                this.login();
            })
            .catch(err => {
                this.error = err.message || 'Signup failed. Please try again.';
            });
        },
        
        login() {
            fetch('http://localhost:3333/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error_message || 'Login failed');
                    });
                }
            })
            .then(data => {
                // Store session token and user info
                localStorage.setItem('session_token', data.session_token);
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_email', this.email);
                
                // Redirect to home
                this.$router.push('/');
            })
            .catch(err => {
                this.error = err.message || 'Login failed. Please try again.';
            });
        }
    }
};
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8dcc4 0%, #f4f1e8 30%, #d9d0ba 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.top-bar {
    position: sticky;
    top: 0;
    padding: 1rem 2.5rem;
    background: rgba(30, 58, 95, 0.95);
    border-bottom: 2px solid #2d5a3d;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand {
    font-weight: 700;
    letter-spacing: 0.02em;
    font-size: 1.35rem;
    color: #f9f6ed;
    cursor: pointer;
    display: inline-block;
    transition: color 0.2s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.brand:hover {
    color: #c9e4ca;
}

.login-card {
    width: min(440px, 100%);
    background: rgba(249, 246, 237, 0.98);
    border: 2px solid #1e3a5f;
    border-radius: 0.75rem;
    padding: 2.5rem;
    box-shadow: 0 8px 24px rgba(26, 35, 50, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    margin: 4rem auto;
}

.login-card h1 {
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    color: #1e3a5f;
    letter-spacing: 0.01em;
    font-weight: 600;
}

.subtitle {
    color: #5a6a7a;
    margin: 0 0 2rem;
    font-size: 0.95rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #d4cdb8;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.8);
}

.form-group input:focus {
    outline: none;
    border-color: #2d5a3d;
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
}

.error-message {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.submit-btn {
    width: 100%;
    padding: 0.875rem;
    background: #1e3a5f;
    color: #f9f6ed;
    border: 2px solid #1e3a5f;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.submit-btn:hover {
    background: #2d5a3d;
    border-color: #2d5a3d;
}

.submit-btn:active {
    transform: translateY(1px);
}

.toggle-mode {
    margin-top: 1.5rem;
    text-align: center;
    color: #5a6a7a;
    font-size: 0.9rem;
}

.toggle-mode a {
    color: #2d5a3d;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
}

.toggle-mode a:hover {
    color: #1f3d29;
    text-decoration: underline;
}

.toggle-mode a:hover {
    color: #ea580c;
}
</style>
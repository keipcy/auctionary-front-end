<template>
    <div class="post-item">
        <header class="top-bar">
            <div class="brand" @click="$router.push('/')">Booktionary</div>
            <nav class="nav-left">
                <a @click="$router.push('/')">Home</a>
            </nav>
            <nav class="nav-right">
                <div v-if="isLoggedIn" class="user-info">
                    <span class="user-email">{{ userEmail }}</span>
                    <button @click="handleLogout" class="logout-btn">Logout</button>
                </div>
                <a v-else @click.prevent="$router.push('/login')">Login</a>
            </nav>
        </header>

        <main class="post-container">
            <div v-if="!isLoggedIn" class="login-required">
                <h2>Login Required</h2>
                <p>You need to be logged in to post an item.</p>
                <button @click="$router.push('/login')" class="btn-primary">Go to Login</button>
            </div>

            <div v-else class="post-form-container">
                <h1>Post a New Item</h1>
                <p class="subtitle">Create your auction listing</p>

                <form @submit.prevent="handleSubmit" class="post-form">
                    <div class="form-group">
                        <label for="name">Item Name *</label>
                        <input
                            id="name"
                            v-model="formData.name"
                            type="text"
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="description">Description *</label>
                        <textarea
                            id="description"
                            v-model="formData.description"
                            placeholder="Describe your item in detail"
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="starting_bid">Starting Bid (in pence) *</label>
                        <input
                            id="starting_bid"
                            v-model.number="formData.starting_bid"
                            type="number"
                            min="0"
                            placeholder="e.g., 1000 for £10.00"
                            required
                            @wheel.prevent
                        />
                        <small class="helper-text">Enter amount in pence (100 = £1.00)</small>
                    </div>

                    <div class="form-group">
                        <label for="end_date">Auction End Date & Time *</label>
                        <input
                            id="end_date"
                            v-model="endDateInput"
                            type="datetime-local"
                            :min="minDateTime"
                            required
                        />
                        <small class="helper-text">Must be in the future</small>
                    </div>

                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>

                    <div v-if="success" class="success-message">
                        {{ success }}
                    </div>

                    <div class="form-actions">
                        <button type="button" @click="$router.push('/')" class="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" :disabled="submitting" class="btn-primary">
                            {{ submitting ? 'Posting...' : 'Post Item' }}
                        </button>
                    </div>
                </form>
            </div>
        </main>
        <Footer />
    </div>
</template>

<script>
import { coreService } from '../services/core.service.js';
import Footer from '../components/Footer.vue';

export default {
    name: 'PostItem',
    components: {
        Footer
    },
    data() {
        return {
            isLoggedIn: false,
            userEmail: '',
            formData: {
                name: '',
                description: '',
                starting_bid: null,
                end_date: null
            },
            endDateInput: '',
            error: null,
            success: null,
            submitting: false,
            minDateTime: ''
        };
    },
    mounted() {
        this.checkLoginStatus();
        this.setMinDateTime();
    },
    methods: {
        checkLoginStatus() {
            const token = localStorage.getItem('session_token');
            const email = localStorage.getItem('user_email');
            if (token && email) {
                this.isLoggedIn = true;
                this.userEmail = email;
            }
        },
        setMinDateTime() {
            // Set minimum datetime to now
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            this.minDateTime = now.toISOString().slice(0, 16);
        },
        handleSubmit() {
            this.error = null;
            this.success = null;

            // Convert datetime-local to Unix timestamp
            const endDate = new Date(this.endDateInput);
            this.formData.end_date = Math.floor(endDate.getTime() / 1000);

            // Validate end date is in the future
            const now = Math.floor(Date.now() / 1000);
            if (this.formData.end_date <= now) {
                this.error = 'End date must be in the future';
                return;
            }

            this.submitting = true;

            const token = localStorage.getItem('session_token');
            
            fetch('http://localhost:3333/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                body: JSON.stringify(this.formData)
            })
            .then(response => {
                if (response.status === 201) {
                    return response.json();
                } else if (response.status === 401) {
                    throw new Error('Unauthorized. Please log in again.');
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error_message || 'Failed to post item');
                    });
                }
            })
            .then(data => {
                this.success = 'Item posted successfully!';
                this.submitting = false;
                
                // Redirect to the new item page after 1.5 seconds
                setTimeout(() => {
                    this.$router.push(`/item/${data.item_id}`);
                }, 1500);
            })
            .catch(err => {
                this.error = err.message || 'Failed to post item. Please try again.';
                this.submitting = false;
            });
        },
        handleLogout() {
            localStorage.removeItem('session_token');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_id');
            this.isLoggedIn = false;
            this.userEmail = '';
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.post-item {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8dcc4 0%, #f4f1e8 30%, #d9d0ba 100%);
}

.post-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.login-required {
    background: rgba(255, 255, 255, 0.9);
    padding: 3rem;
    border-radius: 0.75rem;
    text-align: center;
    box-shadow: 0 4px 16px rgba(26, 35, 50, 0.1);
    border: 2px solid var(--stroke);
}

.login-required h2 {
    color: var(--navy);
    margin-bottom: 1rem;
}

.login-required p {
    color: var(--muted);
    margin-bottom: 1.5rem;
}

.post-form-container {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0.75rem;
    padding: 2.5rem;
    box-shadow: 0 4px 16px rgba(26, 35, 50, 0.1);
    border: 2px solid var(--stroke);
}

.post-form-container h1 {
    font-size: 2rem;
    color: var(--navy);
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.subtitle {
    color: var(--muted);
    margin-bottom: 2rem;
    font-size: 1rem;
}

.post-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .post-container {
        margin: 1rem auto;
    }
    
    .post-form-container {
        padding: 1.5rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .btn-primary,
    .btn-secondary {
        width: 100%;
    }
}
</style>

<template>
    <div class="home">
        <header class="top-bar">
            <div class="brand" @click="$router.push('/')">Booktionary</div>
            <nav class="nav-left">
                <a href="#search">Search Items</a>
                <a href="#" @click.prevent="$router.push('/post')">Post Items</a>
            </nav>
            <nav class="nav-right">
                <div v-if="isLoggedIn" class="user-info">
                    <span class="user-email">{{ userEmail }}</span>
                    <button @click="handleLogout" class="logout-btn">Logout</button>
                </div>
                <a v-else href="#login" @click.prevent="$router.push('/login')">Login</a>
            </nav>
        </header>

        <main class="hero">
            <div class="hero-content">
                <h1>Find and share standout items</h1>
                <p class="subtitle">Browse auctions, post your finds, and stay ahead of the next bid.</p>
                <div class="search-bar" id="search">
                    <input
                        v-model="query"
                        type="search"
                        placeholder="Search by item, category, or seller"
                        @keyup.enter="onSearch"
                    />
                    <button @click="onSearch">Search</button>
                </div>
            </div>

            <div class="items-section">
                <div v-if="searching" class="search-status">
                    <p>Searching...</p>
                </div>

                <div v-if="searchError" class="search-error">
                    <p>{{ searchError }}</p>
                </div>

                <div v-if="searchResults.length > 0" class="search-results">
                    <h2>Search Results</h2>
                    <div class="results-grid">
                        <div v-for="item in searchResults" :key="item.item_id" class="result-card" @click="viewItem(item.item_id)">
                            <h3>{{ item.title || item.name }}</h3>
                            <p>{{ item.description }}</p>
                            <p class="price" v-if="item.starting_bid">£{{ formatPrice(item.starting_bid) }}</p>
                        </div>
                    </div>
                </div>

                <div v-else-if="!searching && availableItems.length > 0" class="available-items">
                    <h2>Available Items</h2>
                    <div class="results-grid">
                        <div v-for="item in availableItems" :key="item.item_id" class="result-card" @click="viewItem(item.item_id)">
                            <h3>{{ item.title || item.name }}</h3>
                            <p>{{ item.description }}</p>
                            <p class="price" v-if="item.starting_bid">£{{ formatPrice(item.starting_bid) }}</p>
                        </div>
                    </div>
                </div>

                <div v-else-if="!searching && !loadingItems && availableItems.length === 0" class="empty-state">
                    <p>No items available at the moment.</p>
                </div>
            </div>
        </main>
        <Footer />
    </div>
</template>

<script>
import { coreService } from '../services/core.service.js';
import Footer from '../components/Footer.vue';
    
    export default {
        name: 'Home',
        components: {
            Footer
        },
        data() {
            return {
                query: '',
                isLoggedIn: false,
                userEmail: '',
                searchResults: [],
                searching: false,
                searchError: '',
                availableItems: [],
                loadingItems: false
            };
        },
        mounted() {
            this.checkLoginStatus();
            this.loadAvailableItems();
        },
        methods: {
            loadAvailableItems() {
                this.loadingItems = true;
                coreService.searchItems()
                    .then((results) => {
                        this.availableItems = results;
                        this.loadingItems = false;
                    })
                    .catch((error) => {
                        console.error('Failed to load items:', error);
                        this.loadingItems = false;
                    });
            },
            checkLoginStatus() {
                const token = localStorage.getItem('session_token');
                const email = localStorage.getItem('user_email');
                if (token && email) {
                    this.isLoggedIn = true;
                    this.userEmail = email;
                }
            },
            handleLogout() {
                // Call logout API
                const token = localStorage.getItem('session_token');
                if (token) {
                    fetch('http://localhost:3333/logout', {
                        method: 'POST',
                        headers: {
                            'X-Authorization': token
                        }
                    }).catch(err => console.error('Logout error:', err));
                }
                
                localStorage.removeItem('session_token');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_id');
                this.isLoggedIn = false;
                this.userEmail = '';
            },
            onSearch() {
                if (!this.query.trim()) return;
                
                this.searching = true;
                this.searchError = '';
                this.searchResults = [];
                
                coreService.searchItems()
                    .then((results) => {
                        this.searchResults = results;
                        this.searching = false;
                    })
                    .catch((error) => {
                        this.searchError = 'Failed to search items. Please try again.';
                        this.searching = false;
                        console.error('Search error:', error);
                    });
            },
            onPost() {
                this.$router.push('/post');
            },
            onExplore() {
                console.log('Navigate to live auctions');
            },
            viewItem(itemId) {
                this.$router.push(`/item/${itemId}`);
            },
            formatPrice(price) {
                return (price / 100).toFixed(2);
            }
        }
    };
</script>

<style scoped>
.home {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8dcc4 0%, #f4f1e8 30%, #d9d0ba 100%);
}

.hero {
    display: grid;
    place-items: center;
    padding: 4rem 1.5rem 5rem;
}

.hero-content {
    width: min(960px, 100%);
    background: linear-gradient(145deg, rgba(249, 246, 237, 0.98), rgba(244, 241, 232, 0.95));
    border: 2px solid var(--navy);
    border-radius: 0.75rem;
    padding: 2.5rem;
    box-shadow: 0 8px 24px rgba(26, 35, 50, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.hero h1 {
    font-size: clamp(2rem, 2.5vw, 3rem);
    margin: 0 0 0.5rem;
    letter-spacing: 0.01em;
    color: var(--navy);
    font-weight: 600;
}

.subtitle {
    margin: 0 0 2rem;
    color: var(--muted);
    max-width: 640px;
}

.search-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--cream);
    border: 2px solid var(--navy);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(26, 35, 50, 0.15);
}

.search-bar input {
    border: none;
    outline: none;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    color: var(--ink);
    border-radius: 0.375rem;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid var(--stroke);
}

.search-bar input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
}

.search-bar button {
    border: none;
    background: var(--accent);
    color: var(--cream);
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
}

.search-bar button:hover {
    background: var(--accent-strong);
}

.search-bar button:active {
    transform: translateY(1px);
}

.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.actions button {
    border: none;
    cursor: pointer;
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    font-size: 1rem;
    font-family: inherit;
}

.actions .primary {
    background: var(--accent);
    color: white;
    border: 2px solid var(--accent);
}

.actions .primary:hover {
    background: var(--accent-strong);
    border-color: var(--accent-strong);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(45, 90, 61, 0.2);
}

.actions .ghost {
    background: transparent;
    color: var(--navy);
    border: 2px solid var(--navy);
}

.actions .ghost:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(45, 90, 61, 0.05);
}

.items-section {
    width: min(1200px, 100%);
    margin: 0 auto;
    padding: 2rem 1.5rem;
}

.search-status {
    text-align: center;
    color: var(--muted);
    font-style: italic;
    padding: 2rem;
}

.search-error {
    padding: 1rem;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 0.5rem;
    border: 1px solid #fca5a5;
    margin-bottom: 2rem;
}

.search-results,
.available-items {
    margin-top: 1rem;
}

.search-results h2,
.available-items h2 {
    font-size: 1.5rem;
    color: var(--navy);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--stroke);
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
}

.result-card {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid var(--stroke);
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
    user-select: none;
}

.result-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(26, 35, 50, 0.2);
    border-color: var(--accent);
    background: rgba(255, 255, 255, 1);
}

.result-card h3 {
    font-size: 1.1rem;
    color: var(--navy);
    margin: 0 0 0.75rem;
    font-weight: 600;
}

.result-card p {
    color: var(--muted);
    margin: 0.5rem 0;
    font-size: 0.95rem;
}

.result-card .price {
    color: var(--accent);
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 1rem;
}

.empty-state {
    text-align: center;
    padding: 3rem 1.5rem;
    color: var(--muted);
    font-size: 1.1rem;
}

@media (max-width: 800px) {
    .top-bar {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(3, auto);
        justify-items: flex-start;
    }

    .nav-left,
    .nav-right {
        width: 100%;
        flex-wrap: wrap;
    }

    .hero {
        padding: 3rem 1rem 4rem;
    }

    .hero-content {
        padding: 2rem;
    }

    .search-bar {
        grid-template-columns: 1fr;
    }

    .search-bar button {
        width: 100%;
    }

    .user-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>
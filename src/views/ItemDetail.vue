<template>
    <div class="item-detail">
        <header class="top-bar">
            <div class="brand" @click="$router.push('/')">Booktionary</div>
            <nav class="nav-left"></nav>
            <nav class="nav-right">
                <div v-if="isLoggedIn" class="user-info">
                    <span class="user-email">{{ userEmail }}</span>
                    <button @click="handleLogout" class="logout-btn">Logout</button>
                </div>
                <a v-else @click.prevent="$router.push('/login')">Login</a>
            </nav>
        </header>

        <main class="item-container">
            <div v-if="loading" class="loading">
                <p>Loading item details...</p>
            </div>

            <div v-else-if="error" class="error">
                <p>{{ error }}</p>
                <button @click="$router.push('/')" class="btn-primary">Go Back Home</button>
            </div>

            <div v-else-if="item" class="item-content">
                <div class="item-header">
                    <h1>{{ item.name }}</h1>
                    <div class="item-meta">
                        <span class="creator">Seller: {{ item.first_name }} {{ item.last_name }}</span>
                    </div>
                </div>

                <div class="item-details">
                    <div class="detail-section">
                        <h2>Description</h2>
                        <p class="description">{{ item.description }}</p>
                    </div>

                    <div class="detail-section">
                        <h2>Bidding Information</h2>
                        <div class="bid-info">
                            <div class="info-row">
                                <span class="label">Starting Bid:</span>
                                <span class="value">£{{ formatPrice(item.starting_bid) }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Current Bid:</span>
                                <div style="position: relative;">
                                    <span class="value current-bid">£{{ formatPrice(item.current_bid) }}</span>
                                    <div v-if="showingBidder && item.current_bid_holder" class="bidder-popup">
                                        <p><strong>{{ item.current_bid_holder.first_name }} {{ item.current_bid_holder.last_name }}</strong></p>
                                        <p class="timestamp">{{ formatDate(lastBidTime) }}</p>
                                        <button @click="showingBidder = false" class="close-btn">✕</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h2>Auction Timeline</h2>
                        <div class="timeline-info">
                            <div class="info-row">
                                <span class="label">Start Date:</span>
                                <span class="value">{{ formatDate(item.start_date) }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">End Date:</span>
                                <span class="value">{{ formatDate(item.end_date) }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Status:</span>
                                <span :class="['value', 'status', getAuctionStatus(item.end_date).class]">
                                    {{ getAuctionStatus(item.end_date).text }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="isLoggedIn && getAuctionStatus(item.end_date).text === 'Active'" class="bid-section">
                        <h2>Place a Bid</h2>
                        <div class="bid-form">
                            <input 
                                v-model.number="bidAmount" 
                                type="number" 
                                :min="formatPrice(item.current_bid)"
                                step="0.01"
                                placeholder="Enter your bid amount in £"
                                class="bid-input"
                            />
                            <button @click="placeBid" class="btn-primary">Place Bid</button>
                        </div>
                        <p v-if="bidError" class="bid-error">{{ bidError }}</p>
                        <p v-if="bidSuccess" class="bid-success">{{ bidSuccess }}</p>
                    </div>

                    <div class="bid-history-section">
                        <h2>Bid History</h2>
                        <div v-if="bidHistory.length > 0" class="bid-history">
                            <div v-for="(bid, index) in bidHistory" :key="index" class="history-item">
                                <div class="history-left">
                                    <p class="bidder-name"><strong>{{ bid.first_name }} {{ bid.last_name }}</strong></p>
                                    <p class="bid-amount">£{{ formatPrice(bid.amount) }}</p>
                                </div>
                                <div class="history-right">
                                    <p class="bid-time">{{ formatDate(bid.timestamp) }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-bids">
                            <p>No bids yet. Be the first to bid!</p>
                        </div>
                    </div>

                    <div class="questions-section">
                        <h2>Questions & Answers</h2>
                        
                        <!-- Ask/Answer Form -->
                        <div v-if="isLoggedIn && !isItemOwner" class="question-form">
                            <h3>Ask a Question</h3>
                            <textarea 
                                v-model="newQuestion" 
                                placeholder="Type your question here..."
                                class="question-input"
                                rows="3"
                            ></textarea>
                            <button @click="submitQuestion" class="btn-primary">Post Question</button>
                            <p v-if="questionError" class="error-msg">{{ questionError }}</p>
                            <p v-if="questionSuccess" class="success-msg">{{ questionSuccess }}</p>
                        </div>

                        <!-- Questions List -->
                        <div v-if="questions.length > 0" class="questions-list">
                            <div v-for="(q, index) in questions" :key="q.question_id" class="question-item">
                                <div class="question-header" @click="toggleAnswer(index)">
                                    <p class="question-text">
                                        <strong>Q:</strong> {{ q.question_text }}
                                    </p>
                                    <span class="toggle-icon">{{ expandedQuestions[index] ? '−' : '+' }}</span>
                                </div>
                                
                                <div v-if="expandedQuestions[index]" class="answer-section">
                                    <div v-if="q.answer_text" class="answer-display">
                                        <p><strong>A:</strong> {{ q.answer_text }}</p>
                                    </div>
                                    <div v-else-if="isItemOwner" class="answer-form">
                                        <textarea 
                                            v-model="answerInputs[q.question_id]" 
                                            placeholder="Type your answer here..."
                                            class="answer-input"
                                            rows="2"
                                        ></textarea>
                                        <button @click="submitAnswer(q.question_id)" class="btn-primary btn-small">Post Answer</button>
                                        <p v-if="answerErrors[q.question_id]" class="error-msg">{{ answerErrors[q.question_id] }}</p>
                                    </div>
                                    <div v-else class="no-answer">
                                        <p><em>No answer yet</em></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="no-questions">
                            <p>No questions yet. Be the first to ask!</p>
                        </div>
                    </div>
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
    name: 'ItemDetail',
    components: {
        Footer
    },
    data() {
        return {
            item: null,
            loading: true,
            error: null,
            isLoggedIn: false,
            userEmail: '',
            userId: null,
            bidAmount: null,
            bidError: null,
            bidSuccess: null,
            bidHistory: [],
            showingBidder: false,
            lastBidTime: null,
            questions: [],
            newQuestion: '',
            questionError: null,
            questionSuccess: null,
            expandedQuestions: [],
            answerInputs: {},
            answerErrors: {}
        };
    },
    computed: {
        isItemOwner() {
            return this.item && this.userId && this.item.creator_id === this.userId;
        }
    },
    mounted() {
        this.checkLoginStatus();
        this.loadItem();
    },
    methods: {
        checkLoginStatus() {
            const token = localStorage.getItem('session_token');
            const email = localStorage.getItem('user_email');
            const userId = localStorage.getItem('user_id');
            if (token && email) {
                this.isLoggedIn = true;
                this.userEmail = email;
                this.userId = userId ? parseInt(userId) : null;
            }
        },
        loadItem() {
            const itemId = this.$route.params.id;
            this.loading = true;
            this.error = null;

            coreService.getItem(itemId)
                .then((item) => {
                    this.item = item;
                    this.loading = false;
                    this.loadBidHistory();
                    this.loadQuestions();
                })
                .catch((err) => {
                    this.error = err || 'Failed to load item details';
                    this.loading = false;
                });
        },
        loadBidHistory() {
            const itemId = this.$route.params.id;
            coreService.getBidHistory(itemId)
                .then((history) => {
                    this.bidHistory = history;
                    if (history.length > 0) {
                        this.lastBidTime = history[0].timestamp;
                    }
                })
                .catch((err) => {
                    console.log('Error loading bid history:', err);
                });
        },
        formatPrice(price) {
            return (price / 100).toFixed(2);
        },
        formatDate(timestamp) {
            const date = new Date(timestamp * 1000);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        getAuctionStatus(endDate) {
            const now = Math.floor(Date.now() / 1000);
            if (endDate > now) {
                return { text: 'Active', class: 'active' };
            } else {
                return { text: 'Ended', class: 'ended' };
            }
        },
        showBidderInfo() {
            if (this.item.current_bid_holder) {
                this.showingBidder = true;
            }
        },
        placeBid() {
            const itemId = this.$route.params.id;
            this.bidError = null;
            this.bidSuccess = null;

            if (!this.bidAmount) {
                this.bidError = 'Please enter a bid amount';
                return;
            }

            // Check for more than 2 decimal places
            if (!/^\d+(\.\d{1,2})?$/.test(this.bidAmount.toString())) {
                this.bidError = 'Bid amount must have a maximum of 2 decimal places';
                return;
            }

            const currentBidInPounds = this.item.current_bid / 100;
            if (this.bidAmount <= currentBidInPounds) {
                this.bidError = `Bid must be higher than current bid (£${this.formatPrice(this.item.current_bid)})`;
                return;
            }

            const bidInPence = Math.round(this.bidAmount * 100);
            coreService.placeBid(itemId, bidInPence)
                .then(() => {
                    this.bidSuccess = 'Bid placed successfully!';
                    this.bidAmount = null;
                    setTimeout(() => {
                        this.loadItem();
                    }, 500);
                })
                .catch((err) => {
                    this.bidError = err || 'Failed to place bid';
                });
        },
        loadQuestions() {
            const itemId = this.$route.params.id;
            coreService.getQuestions(itemId)
                .then((questions) => {
                    this.questions = questions;
                    this.expandedQuestions = new Array(questions.length).fill(false);
                })
                .catch((err) => {
                    console.log('Error loading questions:', err);
                });
        },
        toggleAnswer(index) {
            this.expandedQuestions[index] = !this.expandedQuestions[index];
            this.$forceUpdate();
        },
        submitQuestion() {
            const itemId = this.$route.params.id;
            this.questionError = null;
            this.questionSuccess = null;

            if (!this.newQuestion.trim()) {
                this.questionError = 'Please enter a question';
                return;
            }

            coreService.askQuestion(itemId, this.newQuestion)
                .then(() => {
                    this.questionSuccess = 'Question posted successfully!';
                    this.newQuestion = '';
                    setTimeout(() => {
                        this.questionSuccess = null;
                        this.loadQuestions();
                    }, 1500);
                })
                .catch((err) => {
                    this.questionError = err || 'Failed to post question';
                });
        },
        submitAnswer(questionId) {
            const answerText = this.answerInputs[questionId];
            
            if (!answerText || !answerText.trim()) {
                this.answerErrors[questionId] = 'Please enter an answer';
                this.$forceUpdate();
                return;
            }

            coreService.answerQuestion(questionId, answerText)
                .then(() => {
                    this.answerInputs[questionId] = '';
                    this.answerErrors[questionId] = null;
                    this.loadQuestions();
                })
                .catch((err) => {
                    this.answerErrors[questionId] = err || 'Failed to post answer';
                    this.$forceUpdate();
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
.item-detail {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8dcc4 0%, #f4f1e8 30%, #d9d0ba 100%);
}

.item-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.item-content {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0.75rem;
    padding: 2.5rem;
    box-shadow: 0 4px 16px rgba(26, 35, 50, 0.1);
    border: 2px solid var(--stroke);
}

.item-header {
    border-bottom: 2px solid var(--stroke);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
}

.item-header h1 {
    font-size: 2rem;
    color: var(--navy);
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.item-meta {
    color: var(--muted);
    font-size: 0.95rem;
}

.creator {
    font-weight: 600;
    color: var(--accent);
}

.bid-form {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.bid-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid var(--stroke);
    border-radius: 0.5rem;
    font-size: 1rem;
    background: white;
    color: var(--ink);
}

.bid-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
}

.detail-section {
    margin-bottom: 2rem;
}

.detail-section h2 {
    font-size: 1.3rem;
    color: var(--navy);
    margin-bottom: 1rem;
    border-left: 4px solid var(--accent);
    padding-left: 1rem;
    font-weight: 700;
}

.description {
    color: var(--ink);
    line-height: 1.7;
    font-size: 1rem;
}

.bid-info, .timeline-info {
    background: var(--surface);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--stroke);
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--stroke);
}

.info-row:last-child {
    border-bottom: none;
}

.label {
    font-weight: 600;
    color: var(--muted);
}

.value {
    color: var(--ink);
    font-weight: 500;
}

.current-bid {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--accent);
}

.status {
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    font-weight: 600;
}

.status.active {
    background: rgba(45, 90, 61, 0.15);
    color: var(--accent-strong);
    border: 1px solid var(--accent);
}

.status.ended {
    background: rgba(192, 57, 43, 0.15);
    color: #c0392b;
    border: 1px solid #e74c3c;
}

.bid-section {
    background: var(--surface);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-top: 2rem;
    border: 2px solid var(--stroke);
}

.bid-section h2 {
    margin-top: 0;
}

.bid-section .btn-primary {
    margin-top: 0;
}

.bid-error {
    color: #c0392b;
    margin-top: 1rem;
    font-weight: 600;
    padding: 0.75rem;
    background: rgba(192, 57, 43, 0.1);
    border-radius: 0.375rem;
    border: 1px solid #e74c3c;
}

.bid-success {
    color: var(--accent-strong);
    margin-top: 1rem;
    font-weight: 600;
    padding: 0.75rem;
    background: rgba(45, 90, 61, 0.1);
    border-radius: 0.375rem;
    border: 1px solid var(--accent);
}

@media (max-width: 768px) {
    .item-container {
        margin: 1rem auto;
    }
    
    .item-content {
        padding: 1.5rem;
    }
    
    .item-header h1 {
        font-size: 1.5rem;
    }
    
    .bid-form {
        flex-direction: column;
    }
}

.bid-hint {
    font-size: 0.75rem;
    color: var(--muted);
    margin-left: 0.5rem;
}

.bidder-popup {
    position: absolute;
    background: white;
    border: 2px solid var(--accent);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 0.5rem;
    box-shadow: 0 4px 12px rgba(45, 90, 61, 0.2);
    min-width: 200px;
    z-index: 10;
}

.bidder-popup p {
    margin: 0.5rem 0;
    color: var(--ink);
}

.bidder-popup .timestamp {
    font-size: 0.85rem;
    color: var(--muted);
}

.close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.25rem;
    color: var(--muted);
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
}

.close-btn:hover {
    color: var(--ink);
}

.bid-history-section {
    margin-bottom: 2rem;
}

.bid-history {
    background: var(--surface);
    border: 1px solid var(--stroke);
    border-radius: 0.5rem;
    overflow: hidden;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--stroke);
}

.history-item:last-child {
    border-bottom: none;
}

.history-left {
    flex: 1;
}

.history-right {
    text-align: right;
}

.bidder-name {
    font-weight: 600;
    color: var(--ink);
    margin: 0;
}

.bid-amount {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
    margin: 0.25rem 0 0 0;
}

.bid-time {
    font-size: 0.85rem;
    color: var(--muted);
    margin: 0;
}

.no-bids {
    background: var(--surface);
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    border: 1px solid var(--stroke);
}

.no-bids p {
    color: var(--muted);
    margin: 0;
}

@media (max-width: 600px) {
    .history-item {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .history-right {
        text-align: left;
        margin-top: 0.5rem;
    }
}

/* Questions Section */
.questions-section {
    margin-bottom: 2rem;
}

.questions-section h2 {
    font-size: 1.3rem;
    color: var(--navy);
    margin-bottom: 1rem;
    border-left: 4px solid var(--accent);
    padding-left: 1rem;
    font-weight: 700;
}

.question-form, .answer-form {
    background: var(--surface);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--stroke);
}

.question-form h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: var(--navy);
}

.question-input, .answer-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--stroke);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 0.75rem;
}

.question-input:focus, .answer-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(45, 90, 61, 0.1);
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.question-item {
    background: var(--surface);
    border: 1px solid var(--stroke);
    border-radius: 0.5rem;
    overflow: hidden;
}

.question-header {
    padding: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s ease;
}

.question-header:hover {
    background: rgba(45, 90, 61, 0.05);
}

.question-text {
    margin: 0;
    color: var(--ink);
    font-size: 1rem;
    flex: 1;
}

.toggle-icon {
    font-size: 1.5rem;
    color: var(--accent);
    font-weight: bold;
    margin-left: 1rem;
}

.answer-section {
    padding: 0 1rem 1rem 1rem;
    border-top: 1px solid var(--stroke);
}

.answer-display p {
    margin: 1rem 0 0 0;
    color: var(--ink);
    line-height: 1.6;
}

.answer-form {
    margin: 1rem 0 0 0;
    padding: 1rem;
}

.no-answer {
    margin-top: 1rem;
}

.no-answer p {
    color: var(--muted);
    font-style: italic;
    margin: 0;
}

.no-questions {
    background: var(--surface);
    padding: 2rem;
    border-radius: 0.5rem;
    text-align: center;
    border: 1px solid var(--stroke);
}

.no-questions p {
    color: var(--muted);
    margin: 0;
}

.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.error-msg {
    color: #c0392b;
    margin-top: 0.5rem;
    font-size: 0.9rem;
}

.success-msg {
    color: var(--accent-strong);
    margin-top: 0.5rem;
    font-size: 0.9rem;
}
</style>


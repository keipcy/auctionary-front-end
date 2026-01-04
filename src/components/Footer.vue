<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Booktionary</h3>
                <p>Your premium online book auction platform</p>
            </div>
            <div class="footer-section">
                <h3>Follow Us</h3>
                <div class="social-links">
                    <a href="#" class="social-icon" title="Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" title="Twitter">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 002.856-3.915 9.957 9.957 0 01-2.828.856 4.958 4.958 0 00-8.611-4.585 4.92 4.92 0 00-1.624 1.215 4.993 4.993 0 00-1.594 4.038 10.009 10.009 0 01-7.14-3.634 4.993 4.993 0 00-.67 2.479c0 1.71.87 3.213 2.188 4.096a4.929 4.929 0 01-2.244-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" title="Instagram">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.521 17.435c-.028.001-.288.151-.633.372-.599.384-1.386.645-2.139.645-.852 0-1.287-.207-1.5-.332-.229-.135-.393-.328-.46-.548l-.047-.165c-.122-.378-.245-.708-.245-1.05 0-.573.575-1.075 1.288-1.075.513 0 .928.274 1.039.965l.184.992c.078.418.203.753.303.93.1.177.291.385.469.465.348.169.982.187 1.232.041.214-.135.289-.333.29-.55l.001-.822.569-.02c.451-.002.482.205.482.501v1.052c0 .694-.207 1.169-.905 1.169-.358 0-.595-.094-.84-.319l-.405-.393-.071.212c-.023.07-.043.133-.063.198.591.577 1.487.577 1.95.577.656 0 1.666-.296 1.221-1.228l-.51-.510zm-1.44-4.867c-.121-.355-.381-.635-.74-.635-.371 0-.64.271-.772.635-.13.362-.109.854.06 1.375.271.852.942 1.375 1.752 1.375.15 0 .267-.015.38-.045-.048-.166-.121-.504-.24-.922-.119-.418-.34-.784-.4-1.002l-.04-.18zm3.585 3.899c-.054.164-.165.252-.385.252-.106 0-.196-.035-.263-.064-.301-.123-.484-.487-.504-.998-.015-.379.035-.704.191-1.038.141-.289.35-.472.648-.472.274 0 .516.229.625.646.083.338.063.996-.03 1.306l-.282.368zm.245-3.671c-.191-.529-.637-.872-1.137-.872-.381 0-.723.201-.946.559-.27.425-.335 1.236-.194 2.068.108.647.535 1.236 1.172 1.236.273 0 .577-.088.825-.257.338-.234.566-.651.673-1.287.089-.521.036-1.297-.393-1.447z"/>
                        </svg>
                    </a>
                    <a href="#" class="social-icon" title="LinkedIn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.25-.129.599-.129.948v5.419h-3.554s.05-8.736 0-9.646h3.554v1.348c.429-.659 1.191-1.595 2.897-1.595 2.117 0 3.704 1.385 3.704 4.362v5.531zM5.337 9.433c-1.144 0-1.915-.759-1.915-1.71 0-.955.771-1.71 1.958-1.71 1.187 0 1.917.755 1.948 1.71 0 .951-.761 1.71-1.991 1.71zm1.581 10.019H3.757V9.934h3.161v9.518zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Booktionary. All rights reserved.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
.footer {
    background: rgba(30, 58, 95, 0.95);
    color: var(--cream);
    padding: 2rem 0 0;
    margin-top: 3rem;
    border-top: 2px solid var(--accent);
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.footer-section h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #c9e4ca;
    font-weight: 700;
}

.footer-section p {
    font-size: 0.95rem;
    color: rgba(249, 246, 237, 0.8);
    line-height: 1.6;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(45, 90, 61, 0.2);
    border: 1px solid rgba(201, 228, 202, 0.3);
    border-radius: 50%;
    color: var(--cream);
    transition: all 0.2s ease;
    text-decoration: none;
}

.social-icon:hover {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
    transform: translateY(-2px);
}

.footer-bottom {
    background: rgba(26, 35, 50, 0.8);
    padding: 1.5rem 2rem;
    text-align: center;
    font-size: 0.9rem;
    color: rgba(249, 246, 237, 0.7);
    border-top: 1px solid rgba(45, 90, 61, 0.3);
}

@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        padding: 1.5rem;
    }
    
    .social-links {
        justify-content: center;
    }
}
</style>

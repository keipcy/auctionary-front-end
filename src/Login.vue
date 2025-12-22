<template>
    <div>
        <h1>Login</h1>

        <form @submit.prevent="handleSubmit">
            <label for="email">Email:</label>
            <input type="email" name="email" v-model="email"/>
            <div v-show="submitted && !email">Email is required</div>

            <br /><br />

            <label for="password">Password: </label>
            <input type="password" name="password" v-model="password"/>
            <div v-show="submitted && !password">Password is required</div>

            <br /><br />

            <button>Login</button>
            <div v-if="error">{{ error }}</div>
        </form>
    </div>
</template>

<script>
    const validator = require("email-validator");
    export default {
        data(){
            return {
                email: "",
                password: "",
                submitted: false
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true
                this.error = ""
                const {email, password} = this

                if(!(email && password)){
                    return;
                }

                if(!(validator.validate(email))){
                    this.error = "Email must be a valid email"
                    return;
                }

                // Has minimum 8 characters in length. Adjust it by modifying {8,}
                // At least one uppercase English letter. You can remove this condition by removing (?=.*?[A-Z])
                // At least one lowercase English letter.  You can remove this condition by removing (?=.*?[a-z])
                // At least one digit. You can remove this condition by removing (?=.*?[0-9])
                // At least one special character,  You can remove this condition by removing (?=.*?[#?!@$%^&*-])
                const password_pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
                if(!(password_pattern.test(password))){
                    this.error = "Password not strong enough"
                    return;
                }
                alert("button clicked")
            }
        }
    }
</script>
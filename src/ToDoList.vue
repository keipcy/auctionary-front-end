<template>
    <div>
        <h1>To Do List</h1>
        <form @submit.prevent="handleToDoSubmit">
            <label for="todo">Add an item to your todo list:</label>
            <input type="item" name="team" v-model="item">

            <br /><br />

            <button>Add to List</button>
            <div v-show="submitted && !item">Can't submit an empty form</div>

            <br /><br />

            <ul>
                <li v-for="(item, index) in item_list" :key="index">
                    {{ item }}
                </li>
            </ul>
        </form>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                item: "",
                submitted: false
            }
        },
        methods: {
            handleToDoSubmit(e) {
                this.submitted = true
                this.error = ""
                const item = this
                const item_list = []

                if(!item){
                    this.error = "Form is empty"
                    return;
                } else {
                    item_list.push(item)
                }
            }
        }
    }
</script>
const API_BASE_URL = 'http://localhost:3333';

const searchItems = (query = '', limit = null) => {
    let url = query 
        ? `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/search`;
    
    // Add limit parameter if specified
    if (limit) {
        url += (query ? '&' : '?') + `limit=${limit}`;
    }
    
    return fetch(url).then((response) => {
        if(response.status === 200){
            return response.json()
        }else{
            throw 'Something went wrong'
        }
    }).then((resJson) => {
        return resJson
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const getItem = (itemId) => {
    return fetch(`${API_BASE_URL}/item/${itemId}`).then((response) => {
        if(response.status === 200){
            return response.json()
        }else if(response.status === 404){
            throw 'Item not found'
        }else{
            throw 'Something went wrong'
        }
    }).then((resJson) => {
        return resJson
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const placeBid = (itemId, amount) => {
    const sessionToken = localStorage.getItem('session_token');
    return fetch(`${API_BASE_URL}/item/${itemId}/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken
        },
        body: JSON.stringify({ amount })
    }).then((response) => {
        if(response.status === 201){
            return response.json()
        }else{
            return response.json().then(err => {
                throw err.error_message || 'Failed to place bid'
            })
        }
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const getBidHistory = (itemId) => {
    return fetch(`${API_BASE_URL}/item/${itemId}/bid`).then((response) => {
        if(response.status === 200){
            return response.json()
        }else{
            throw 'Something went wrong'
        }
    }).then((resJson) => {
        return resJson
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const getQuestions = (itemId) => {
    return fetch(`${API_BASE_URL}/item/${itemId}/question`).then((response) => {
        if(response.status === 200){
            return response.json()
        }else{
            throw 'Something went wrong'
        }
    }).then((resJson) => {
        return resJson
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const askQuestion = (itemId, questionText) => {
    const sessionToken = localStorage.getItem('session_token');
    return fetch(`${API_BASE_URL}/item/${itemId}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken
        },
        body: JSON.stringify({ question_text: questionText })
    }).then((response) => {
        if(response.status === 200){
            return response.json()
        }else{
            return response.json().then(err => {
                throw err.error_message || 'Failed to post question'
            })
        }
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const answerQuestion = (questionId, answerText) => {
    const sessionToken = localStorage.getItem('session_token');
    return fetch(`${API_BASE_URL}/question/${questionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken
        },
        body: JSON.stringify({ answer_text: answerText })
    }).then((response) => {
        if(response.status === 200){
            return response.json()
        }else{
            return response.json().then(err => {
                throw err.error_message || 'Failed to answer question'
            })
        }
    }).catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

export const coreService = {
    searchItems,
    getItem,
    placeBid,
    getBidHistory,
    getQuestions,
    askQuestion,
    answerQuestion
}
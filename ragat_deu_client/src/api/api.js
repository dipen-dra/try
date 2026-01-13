import axios from 'axios';

const API_URL=`${import.meta.env.VITE_API_BASE_URL}/api` || 
'http://localhost:5050/api' //fallback

const instance=axios.create(
    {
        baseURL:API_URL,
        headers:{
            "Content-Type": "application/json",
        }
    }
)
instance.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token")
    if(token){
        config.headers.Authorization="Bearer "+token
    }
    return config
})

export default instance;
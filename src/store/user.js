export default {
    namespaced:true,
    state:{
        profile:JSON.parse(localStorage.getItem('profile')) || {},
    },
    getters:{
        islogin(){
            return Boolean(localStorage.getItem('profile')) || false;
        }
    },
    mutations:{
        setProfile(state,value){
            state.profile = value;
            localStorage.setItem('profile',JSON.stringify(value));
        }
    },
    actions:{
        
    }
}
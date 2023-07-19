export default {
    namespaced:true,
    state:{
        profile:JSON.parse(localStorage.getItem('profile')) || {},
        likelist:new Set(JSON.parse(localStorage.getItem('likelist'))) || new Set(),
        playlist:[],
        playlistCache:[],
    },
    getters:{
        islogin(){
            return Boolean(localStorage.getItem('cookie')) || false;
        }
    },
    mutations:{
        setProfile(state,value){
            state.profile = value;
            localStorage.setItem('profile',JSON.stringify(value));
        },
        setLikelist(state,value){
            state.likelist = new Set(value);
            localStorage.setItem('likelist',JSON.stringify(value));
        },
        deleteLike(state,value){
            state.likelist.delete(value);
            localStorage.setItem('likelist',JSON.stringify(Array.from(state.likelist)));
        },
        addLike(state,value){
            state.likelist.add(value);
            localStorage.setItem('likelist',JSON.stringify(Array.from(state.likelist)));
        },
        setPlaylist(state,value){
            state.playlist = value;
        },
        setPlaylistCache(state,value){
            state.playlistCache = value;
        }
    },
    actions:{
        
    }
}
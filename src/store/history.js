export default {
    namespaced:true,
    state:{
        searchHistory:JSON.parse(localStorage.getItem('searchHistory')) || [],
    },
    mutations:{
        setSearchHistory(state,value){
            if(state.searchHistory.length >= 20){
                state.searchHistory.pop();
            }
            const index = state.searchHistory.indexOf(value);
            if(index >= 0){
                state.searchHistory.splice(index,1);
            }
            state.searchHistory.unshift(value);
            localStorage.setItem('searchHistory',JSON.stringify(state.searchHistory));
        },
        deleteSearchHistory(state,index){
            state.searchHistory.splice(index,1);
            localStorage.setItem('searchHistory',JSON.stringify(state.searchHistory));
        },
        deleteSearchHistoryAll(state){
            state.searchHistory = [];
            localStorage.setItem('searchHistory',JSON.stringify(state.searchHistory));
        },
    },
    acitons:{

    }
}
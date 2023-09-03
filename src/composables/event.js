import { onMounted, onUnmounted } from "vue";

export function useEventListener(target, event, callback,options = false){
    onMounted(()=>{    
        target.addEventListener(event,callback,options);
    })
    onUnmounted(()=>{    
        target.removeEventListener(event,callback,options);
    })
}
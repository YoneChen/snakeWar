import search from '@/components/search';
import '@/css/index'
document.querySelector('.input').addEventListener('focus',e => {
    new search(document.body,function(res){
        
    }).show();
});

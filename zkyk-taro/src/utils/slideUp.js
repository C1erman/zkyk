// 滑动效果
function slideUp(){
    let timer = setInterval(() => {
        let lengthToTop = document.documentElement.scrollTop || document.body.scrollTop;
        let speed = -(lengthToTop / 5);
        document.body.scrollTop = document.documentElement.scrollTop = lengthToTop + speed;
        if(lengthToTop <= 0) clearInterval(timer);
    }, 30);
}

function slideUpDom(dom){
    let onGoing = false;
    let timer;
    window.onscroll = function(){
        let screenHeight = document.documentElement.clientHeight || window.innerHeight;
        let lengthToTop = document.documentElement.scrollTop || document.body.scrollTop;
        if(!onGoing) clearInterval(timer);
        onGoing = false;
        dom.style.display = ( lengthToTop > screenHeight ) ? 'block' : 'none';
    }
    dom.addEventListener('click', () => {
        clearInterval(timer);
        timer = setInterval(() => {
            let lengthToTop = document.documentElement.scrollTop || document.body.scrollTop;
            let speed = -(lengthToTop / 3);
            onGoing = true;
            document.body.scrollTop = document.documentElement.scrollTop = lengthToTop + speed;
            if(lengthToTop <= 0) clearInterval(timer);
        }, 30);
    })
}

function slideToDom(dom){
    let timer = setInterval(() => {
        //均相对于其 offsetParent
        let position = dom.offsetTop;
        let lengthToTop = document.documentElement.scrollTop || document.body.scrollTop;
        let screenHeight = document.documentElement.clientHeight || window.innerHeight; 
        let fullHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

        let speed = (position - lengthToTop) / 5;

        document.body.scrollTop = document.documentElement.scrollTop = lengthToTop + speed;
        lengthToTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 边界判断条件可能有失偏颇
        if(Math.abs(lengthToTop - position) <= 5 || fullHeight - lengthToTop - screenHeight <= 5) clearInterval(timer);
    },30)
}

export {
    slideUp,
    slideUpDom,
    slideToDom
}
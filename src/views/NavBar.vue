<template>
    <nav>
        <div>
            <RouterLink to="/"><img src="@/assets/images/nav_bar/logo.png" /></RouterLink>
        </div>
        <ul>
            <li>
                <a href="https://programtheworld.tw/donate/donate" alt="捐款">
                    <img src="@/assets/images/nav_bar/donateV2.png" class="navbar_picAndText"/>
                </a>
            </li>
            <li>
                <a href="#grade-title" alt="遊戲"><img src="@/assets/images/nav_bar/sharingV2.png" class="navbar_picAndText"/>
                </a>
            </li>
            <li>
                <a href="https://programtheworld.tw/works/index" alt="耕耘" >
                    <img src="@/assets/images/nav_bar/effortV2.png" class="navbar_picAndText"/>
                </a>
            </li>
            <li>
                <a href="https://programtheworld.tw/about/about?pagetarget=us" alt="關於" >
                    <img src="@/assets/images/nav_bar/aboutV2.png" class="navbar_picAndText"/>
                </a>
            </li>
            <li>
                <a href="https://www.facebook.com/program.the.world" alt="facebook" id="FB_img">
                    <img src="@/assets/images/nav_bar/facebook.png" class="navbar_pic"/>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>

</script>

<style scoped lang="scss">
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #F19C79;
    padding: 0 1rem;
    height: 10vh;
}

nav div img {
    height: 4rem; 
    width: auto;
}

nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
    justify-content: center;
    width: 60%; 
}

nav ul li {
    margin: 0 0.5rem;
    flex: 1 1 auto;
}

nav ul li a {
    text-decoration: none;
    
}

.navbar_picAndText{
    max-width: 200px; /* 讓圖片在容器內部自適應 */
    height: auto; /* 保持圖片的長寬比 */
}

.navbar_picAndText{
    width:100% ;
}

.navbar_pic{
    width:80% ;
}

nav ul li a img:hover {
    transform: scale(1.1);
}

nav ul li a img {
    transition: transform 0.3s;
}

.navbar_pic {
    max-width: 60px; /* 設定圖片的最大寬度 */
}

@media (max-width: 990px) {

    nav ul {
        display:none;
    }
}


</style>
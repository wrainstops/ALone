mixins.home = {
    data() {
        return {
            currentImageIndex: 0,
            imageInterval: null,
            imageChangeInterval: 15000, // 15秒切换一次
        };
    },
    mounted() {
        let background = this.$refs.homeBackground;
        let images = background.dataset.images.split(",");
        
        // 如果有多张图片，启动轮播
        if (images.length > 1) {
            this.startImageCarousel(background, images);
        } else {
            // 只有一张图片，直接设置
            background.style.backgroundImage = `url('${images[0]}')`;
        }
        
        this.menuColor = true;
    },
    beforeUnmount() {
        // 清除定时器
        if (this.imageInterval) {
            clearInterval(this.imageInterval);
        }
    },
    methods: {
        startImageCarousel(background, images) {
            // 设置初始图片
            background.style.backgroundImage = `url('${images[this.currentImageIndex]}')`;
            
            // 启动轮播定时器
            this.imageInterval = setInterval(() => {
                this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
                background.style.backgroundImage = `url('${images[this.currentImageIndex]}')`;
            }, this.imageChangeInterval);
        },
        homeClick() {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        },
    },
};

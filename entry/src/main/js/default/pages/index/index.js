import router from '@system.router';

export default {
    data: {
        title: ""
    },
    onInit() {
        this.title = this.$t('strings.world');
    },
    // 点击事件
    clickText: function(){
        this.title = "好好好"
        // 摩尔斯电码
        var words = ['S', 'O', 'S']
        this.toLightPage(words)
    },
    // 跳转到发光页面，并传递对应的摩尔斯电码(code)
    toLightPage: function(words){
        var url = "pages/light/light"
        this.title = typeof router
        this.title = typeof router.replace
        console.log("toLight page");
        router.replace({
            uri: url,
            params: {
                words: words
            }
        })
    }
}

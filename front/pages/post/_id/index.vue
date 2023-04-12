<template>
    <v-container v-if="post">
        <post-card :post="post"/>
    </v-container>
    <div v-else>
        해당 아이디의 게시글이 존재하지 않습니다.
    </div>
</template>

<script>
    import PostCard from '~/components/PostCard';
    export default {
        components:{
            PostCard,
        },
        data(){
            return {
                name: 'Nuxt.js',
            };
        },
        computed:{
            post(){
                return this.$store.state.posts.mainPosts.find(v=> v.id === parseInt(this.$route.params.id,10));
            },
        },
        fetch({store, params}){
            return store,dispatch('posts/loadPost',params.id);
        },
        head(){
            return {//nuxt-config.js 에서 잡아준 메타 정보를 각 개인 페이지에서 덮어씌워준다.
                title:`${this.post.User.nickname}님의 게시글`,
                meta:[{
                    name:'description', content:this.post.content,
                },{ //hid를 넣어줘야 공통에서 잡은 같은 id의 og 태그가 덮어씌워진다.
                    hid:'ogtitle',property:'og:title', content:`${this.post.User.nickname}님의 게시글`,
                },{
                    hid:'ogdescription',property:'og:description', content:this.post.content,
                },{
                    hid:'ogimage',property:'og:image', content:this.post.Images[0] ? this.post.Images[0].src:'https://vue.nodebird.com/vue-nodebird.png',
                },{
                    hid:'ogurl',property:'og:url', content:`https://vue.nodebird.com/post/${this.post.id}`,
                }],
            };
        }
    }
</script>

<style>

</style>

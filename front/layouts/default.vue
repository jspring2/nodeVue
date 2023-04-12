<template>
    <v-app>
        <nav>
            <v-toolbar dark color="green">
                <v-toolbar-title>
                    <nuxt-link to="/" :style="{color:'white'}">NoveVue</nuxt-link>
                </v-toolbar-title>
            
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-form @submit.prevent="onSearchHashtag">
                        <div :style="{ display:'flex', height: '100%',alignItems:'center' }">
                            <v-text-field
                                v-model="hashtag" 
                                label="검색" 
                                hide-details 
                                prepend-icon="mdi-magnify" 
                            />
                        </div>
                    </v-form>
                    <v-btn text nuxt to="/profile" :style="{ display:'flex', alignItems:'center' }">
                        <div>프로필</div>
                    </v-btn>
                    <v-btn text nuxt to="/signup" :style="{ display:'flex', alignItems:'center' }">
                        <div>회원가입</div>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
        </nav>
        <!-- <div>{{name}}</div>
        <v-btn @click="onChangeName">바이바이</v-btn> -->
        <!-- xs, sm, md, lg, xl -->
        <v-row no-gutters>
            <v-col cols="12" xs="12" md="4">
                <login-form/>
            </v-col>
            <v-col cols="12" xs="12" md="8">
                <nuxt /> <!-- nuxt 를 명시해줘야 router vue(바뀌는 부분) 이 됨 -->
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
    import LoginForm from '~/components/LoginForm'; //~ 은 소스들의 루트 폴더 (절대경로 잡기)

    export default {
        components:{
            LoginForm,
        },
        data(){
            return {
                hashtag: '',
            };
        },
        computed:{
            name(){
                return this.$store.state.posts.name;
            }
        },
        methods: {
            onChangeName(){
                this.$store.commit('posts/BYE');
            },
            onSearchHashtag(){
                this.$router.push({
                    path: `/hashtag/${this.hashtag}`,
                });
                this.hashtag = '';
            },
        }
    }
</script>

<style scoped>
    a {
        display: inline-block;
        color:inherit;
        text-decoration: none;
    }
</style>

export const state = () => ({
    me: null,
    followerList: [],
    followingList: [],
    hasMoreFollower: true,
    hasMoreFollowing: true,
});

const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

export const mutations ={
    setMe(state, payload) {
        state.me = payload;
    },
    changeNickname(state, payload){
        state.me.nickname = payload.nickname;
    },
    addFollower(state, payload){
        state.followerList.push(payload);
    },
    addFollowing(state, payload){
        state.followingList.push(payload);
    },
    removeFollowing(state, payload){
        console.log("payload : "+payload.id);
        const index = state.followerList.findIndex(v=>v.id === payload.id);
        state.followingList.splice(index,1);
    },
    removeFollower(state, payload){
        console.log("payload : "+payload.id);
        const index = state.followingList.findIndex(v=>v.id === payload.id);
        state.followerList.splice(index,1);
    },
    loadFollowings(state, payload){
        const diff = totalFollowings - state.followingList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v=>({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random()*1000),
        }));
        state.followingList = state.followingList.concat(fakeUsers);
        state.hasMoreFollowing = fakeUsers.length === limit;
    },
    loadFollowers(state, payload){
        const diff = totalFollowers - state.followerList.length;
        const fakeUsers = Array(diff > limit ? limit : diff).fill().map(v=>({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random()*1000),
        }));
        state.followerList = state.followerList.concat(fakeUsers);
        state.hasMoreFollower = fakeUsers.length === limit;
    },
};

export const actions = {
    async loadUser({commit, state}){
        try {
            await this.$axios.get('/api/user',{
                withCredentials: true,
            }).then((res)=>{
                commit('setMe',res.data); 
                console.log(state);
            }).catch((err)=>{
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    },
    signUp({commit, state}, payload){
        // 서버에 회원가입 요청
        this.$axios.post('/api/user',{
            email: payload.email,
            nickname: payload.nickname,
            password: payload.password,
        }).then((res)=>{
            console.log(res.data);
            commit('setMe',res.data);
        }).catch((err)=>{
            console.error(err);
        }); //REST API
    },
    logIn({commit}, payload){
        this.$axios.post('/api/user/login',{
            email: payload.email,
            password: payload.password,
        },{
            withCredentials: true,
        }).then((res)=>{
            commit('setMe',res.data);
        }).catch((err)=>{
            console.error(err);
        });
    },
    logOut({commit}){
        this.$axios.post('/api/user/logout',{},{
            withCredentials: true,
        }).then((data)=>{
            commit('setMe',null);
        }).catch((err)=>{
            console.error(err);
        });
    },
    changeNickname({commit},payload){
        commit('changeNickname',payload);
    },
    addFollower({ commit },payload){
        commit('addFollower',payload);
    },
    addFollowing({ commit },payload){
        commit('addFollowing',payload);
    },
    removeFollowing({ commit },payload){
        //비동기 요청
        commit('removeFollowing',payload);
    },
    removeFollower({ commit },payload){
        commit('removeFollower',payload);
    },
    loadFollowers({ commit,state },payload){
        if(state.hasMoreFollower){
            commit('loadFollowers');
        }
    },
    loadFollowings({ commit,state },payload){
        if(state.hasMoreFollowing){
            commit('loadFollowings');
        }
    },
};
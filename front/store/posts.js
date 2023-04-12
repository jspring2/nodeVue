export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});

const limit = 10;
const totalPosts = 101;

export const mutations ={
    addMainPost(state,payload) {
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },
    removeMainPost(state,payload){
        const index = state.mainPosts.findIndex(v=> v.id === payload.postId);
        state.mainPosts.splice(index,1);
    },
    addComment(state,payload){
        const index = state.mainPosts.findIndex(v=> v.id === payload.postId);
        state.mainPosts[index].Comments.unshift(payload);
    },
    loadComments(state, payload){
        const index = state.mainPosts.findIndex(v=> v.id === payload.postId);
        state.mainPosts[index].Comments = payload;
    },
    loadPosts(state, payload){
        /*
        //더미데이터
        const diff = totalPosts - state.mainPosts.length;
        const fakePosts = Array(diff>limit ? limit : diff).fill().map( v=> ({
            id: Math.random().toString(),
            User: {
                id:1,
                nickname: 'ㅎㅎ',
            },
            content: `Hello infinite scrolling~ ${Math.random()}`,
            Comments: [],
            Images: [],
        }));
        state.mainPosts = state.mainPosts.concat(fakePosts);
        state.hasMorePost = fakePosts.length === limit;
        */
        state.mainPosts = state.mainPosts.concat(payload);
        state.hasMorePost = payload.length === limit;
    },
    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    removeImagePath(state, payload) {
        state.imagePaths.splice(payload, 1);
    },
    unlikePost(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        const userIndex = state.mainPosts[index].Likers.findIndex(v => v.id === payload.userId);
        state.mainPosts[index].Likers.splice(userIndex, 1);
    },
    likePost(state, payload){
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id: payload.userId,
        });
    },
};

export const actions = {
    add({ commit,state },payload) {
        //서버에 게시글 등록 요청 보냄
        this.$axios.post('/api/post', {
            content: payload.content,
            image: state.imagePaths,   
        },{
            withCredentials: true,
        }).then((res)=>{
            commit('addMainPost',res.data);
        }).catch(()=>{

        })
    },
    //post,put,patch 만 두 번째 데이터, 세 번째 옵션
    //delete, get 은 두 번째 옵션
    remove({ commit },payload){
        this.$axios.delete(`/api/post/${payload.postId}`,{
            widtCredentials:true,
        }).then((res)=>{
            commit('removeMainPost',payload);
        }).catch((err)=>{
            console.log(err);
        });
    },
    addComment({ commit },payload){
        this.$axios.post(`/api/post/${payload.postId}/comment`,{
            content: payload.content,
        },{
            withCredentials: true,
        }).then((res)=>{
            commit('addComment',res.data);
        }).catch((err)=>{
            console.log(err);
        });
        
    },
    loadComments({ commit },payload){
        this.$axios.get(`/api/post/${payload.postId}/comments`)
        .then((res)=>{
            commit('loadComments',res.data);
        }).catch((err)=>{
            console.error(err);
        });
    },
    loadPosts({commit,state},payload){
        if(state.hasMorePost){
            this.$axios.get(`/api/posts?offset=${state.mainPosts.length}&limit=10`)
                .then((res)=>{
                    commit('loadPosts',res.data);
                })
                .catch((err)=>{
                    console.error(err);
                });
            
        }
    },
    uploadImages({ commit },payload){
        this.$axios.post('/api/post/images', payload, {
            withCredentials: true,
        }).then((res)=>{
            console.log("uploadImages : ",res.data)
            commit('concatImagePaths',res.data);
        }).catch((err)=>{
            console.error(err);
        })
    },
    retweet({ commit },payload){
        this.$axios.post(`/api/post/${payload.postId}/retweet`,{},{
            withCredentials: true,
        })
        .then((res)=>{
            commit('retweet',res.data);
        })
        .catch((err)=>{
            console.error(err);
            alert(err.response.data);
        });
    },
    likePost({ commit },payload) {
        this.$axios.post(`/api/post/${payload.postId}/like`,{},{
            withCredentials: true,
        })
        .then((res)=>{
            commit('likePost',{
                userId: res.data.userId,
                postId: payload.postId,
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    },
    unlikePost({ commit },payload){
        this.$axios.delete(`/api/post/${payload.postId}/like`,{
            withCredentials: true,
        })
        .then((res)=>{
            commit('unlikePost',{
                userId: res.data.userId,
                postId: payload.postId,
            });
        })
        .catch((err)=>{
            console.error(err);
        });
    },
};
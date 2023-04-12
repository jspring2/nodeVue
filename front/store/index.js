export const state = () => ({
    name: 'vuex',
});

export const mutations ={
};

export const actions = {
    /** 모든 페이지에서 화면 로드시 실행되는 모듈 */
    nuxtServerInit({commit, dispatch, state},{req}){
        return dispatch('users/loadUser');
    },
};
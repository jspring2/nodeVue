module.exports = {
    head: {
        title: 'NodeVue',
        meta: [{
            charset: 'utf-8',
        },{
            name:'viewport',
            content:'width=device-width,initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
        },{
            'http-equiv':'X-UA-Compatible', content: 'IE=edge',
        },{
            hid:'desc',name:'description', content:'NodeBird TEST',
        },{
            hid:'ogtitle',name:'og:title', content:'NodeBird',
        },{
            hid:'ogdescription',name:'og:description', content:'제로초의 NodeBird SNS',
        },{
            hid:'ogtype',name:'og:type', content:'website',
        },{
            hid:'ogimage',name:'og:image', content:'https://vue.nodevird.com/vue-nodebird.png',
        },{
            hid:'ogurl',name:'og:url', content:'https://vue.nodevird.com',
        }],
        link: [{ rel:'shortcut icon', href:'/vue-nodebird.png' }], //favicon 접근시 static에 파일을 넣어주면 알아서 접근함
    },
    modules: [
        '@nuxtjs/axios'
    ],
    axios:{
        proxy: true,
    },
    proxy:{
        '/api/' : 'http://localhost:3085',
    },
    plugins: [

    ],
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment',
    ],
    moment: {
        locales: ['ko'],
    },
    build: {
        analyze: false, //배포 전 빌드에서만 true로 확인
        extend(config, { isClient, isServer, isDev }){
            if(isServer && !isDev){
                config.devtool = 'hidden-source-map';
            }
            console.log('webpack',config, isServer, isClient);
        },
    },
    vuetify: {

    },
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false,
    },
};
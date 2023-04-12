<template>
    <v-container>
        <div>
		    <button @click="makePDF">PDF</button>
		    <button @click="makePDF">암호화테스트1</button>
	    </div>
        <post-form v-if="me" data-html2canvas-ignore="true"/>
        <div id="pdfTarget">
            <post-card v-for="p in mainPosts" :key="p.id" :post="p"/>
            <div data-html2canvas-ignore="true">출력하지 않고 싶은 영역은 태그에 'data-html2canvas-ignore' attribute를 넣어주면된다.</div>
        </div>
    </v-container>
</template>

<script>
    import PostCard from '~/components/PostCard';
    import PostForm from '~/components/PostForm';
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';

    export default {
        name: 'pdf',
        components:{
            PostCard,
            PostForm,
        },
        data(){
            return {
                name: 'Nuxt.js',
                propTitle: 'mypdf',
            }
        },
        computed:{
            me(){
                return this.$store.state.users.me;
            },
            mainPosts(){
                return this.$store.state.posts.mainPosts;
            },
            hasMorePost(){
                return this.$store.state.posts.hasMorePost;
            },
        },
        fetch({ store }){
            return store.dispatch('posts/loadPosts');
        },
        asyncData(){
            return {};
        },
        mounted(){
            window.addEventListener('scroll',this.onScroll);
        },
        beforeDestroy(){
            window.removeEventListener('scroll',this.onScroll);
        },
        methods:{
            onScroll(){
                if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
                    if(this.hasMorePost){
                        this.$store.dispatch('posts/loadPosts');
                    }
                }
            },
            makePDF(selector = '#pdfTarget') {
                // if(selector = 'asd'){
                //     alert('잉?');
                // }
                window.html2canvas = html2canvas //Vue.js 특성상 window 객체에 직접 할당해야한다.
                let pdf = new jsPDF('p', 'mm', 'a4')
                let canvas = pdf.canvas
                const pageWidth = 210 //캔버스 너비 mm
                const pageHeight = 295 //캔버스 높이 mm
                canvas.width = pageWidth
                //let ele = document.querySelector(selector)
                let ele = document.querySelector('#pdfTarget')
                let width = ele.offsetWidth // 셀렉트한 요소의 px 너비
                let height = ele.offsetHeight // 셀렉트한 요소의 px 높이
                let imgHeight = pageWidth * height / width // 이미지 높이값 px to mm 변환
                if (!ele) {
                    console.warn(selector + ' is not exist.')
                    return false
                }
                console.log('#### html2canvas 시작'+ele+"/ imgHeight : "+imgHeight)
                // html2canvas(ele, {
                //     onrendered: function (canvas) {
                //         console.log('#### 5')
                //         let position = 0
                //         const imgData = canvas.toDataURL('image/png')
                //         pdf.addImage(imgData, 'png', 0, position, pageWidth, imgHeight, undefined, 'slow')
                //         console.log('#### 6')
                //         //Paging 처리
                //         let heightLeft = imgHeight //페이징 처리를 위해 남은 페이지 높이 세팅.
                //         heightLeft -= pageHeight
                //         while (heightLeft >= 0) {
                //             console.log('#### 7')
                //             position = heightLeft - imgHeight
                //             pdf.addPage();
                //             pdf.addImage(imgData, 'png', 0, position, pageWidth, imgHeight)
                //             heightLeft -= pageHeight
                //         }
                //         console.log('#### 8')
                //         pdf.save(this.propTitle.toLowerCase() + '.pdf')
                //         console.log('#### 9')
                //     },

                // });
                html2canvas(ele).then(canvas => {
                    //document.body.appendChild(canvas)
                        let position = 0
                        const imgData = canvas.toDataURL('image/png')
                        pdf.addImage(imgData, 'png', 0, position, pageWidth, imgHeight, undefined, 'slow')
                        //Paging 처리
                        let heightLeft = imgHeight //페이징 처리를 위해 남은 페이지 높이 세팅.
                        heightLeft -= pageHeight
                        while (heightLeft >= 0) {
                            position = heightLeft - imgHeight
                            pdf.addPage();
                            pdf.addImage(imgData, 'png', 0, position, pageWidth, imgHeight)
                            heightLeft -= pageHeight
                        }
                        // 다운로드시에만 서버 저장할때는 사용하지 않음
                        pdf.save(this.propTitle.toLowerCase() + '.pdf')
                        console.log("save 후 : "+pdf.output('datauristring'))
                });
            },
        },
    }
</script>ㅣ

<style>

</style>

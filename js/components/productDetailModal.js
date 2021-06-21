
export default{

    template:'#userProductModal',

    props:{
        product:{
            type: Object,
            default(){
                return{}
            }
        },
    },

    data(){
        return{
            modal:'',
            qty: 1,
        }
    },

    methods: {
        
        openModal(){
            this.modal.show();
        },

        closeModal(){
            this.modal.hide();
        }
        
    },

    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
}
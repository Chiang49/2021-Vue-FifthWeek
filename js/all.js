
const url = 'https://vue3-course-api.hexschool.io/';
const path = 'chiang666';

import productDetail from './components/productDetailModal.js';

//定義規則
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

//加入本地語系
VeeValidateI18n.loadLocaleFromURL('/zh_TW.json');
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    // validateOnInput: true, // 調整為輸入字元立即進行驗證
  });


const app = Vue.createApp({

    data(){
        return{
            products:[],
            product:{},
            shoppingCar:[],
            carTotal:0,
            form:{
                user: {
                    name: "",
                    email: "",
                    tel: "",
                    address: ""
                },
                message:"",
            },
            loadingStatu:""
        }
    },

    methods:{

        //取得商品資料
        getProductsData(page = 1){
            
            axios.get(`${url}api/${path}/products?page=${page}`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.products = res.data.products;
                }else{
                    alert("資料載入失敗");
                }
                // console.log(this.products);
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //取得商品細節
        getProductDetail(id){
            this.loadingStatu = id;
            axios.get(`${url}api/${path}/product/${id}`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.loadingStatu = "";
                    this.product = res.data.product;
                    this.$refs.userProductModal.openModal();
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //加入購物車
        addCar( id, qty = 1){
            const product = {
                product_id: id,
                qty
            }

            this.$refs.userProductModal.closeModal();
            this.loadingStatu = id;
            axios.post(`${url}api/${path}/cart`,{ data:product })
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.loadingStatu = "";
                    alert(res.data.message);
                    this.getCar();
                }else{
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //取得購物車
        getCar(){

            axios.get(`${url}api/${path}/cart`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.shoppingCar = res.data.data.carts;
                    // console.log(this.shoppingCar);
                    let total = 0;
                    this.shoppingCar.forEach((item) => {
                        total += item.final_total;
                    });
                    this.carTotal = total;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //更新購物車
        updateCar(id,productId){
            let data = {
                product_id: "",
                qty:1
            }
            this.shoppingCar.forEach((item) => {
                if(item.product_id === productId){
                    data.product_id = item.product_id;
                    data.qty = item.qty;
                }
            })
            
            axios.put(`${url}api/${path}/cart/${id}`,{ data })
            .then((res) => {
                console.log(res);
                if(res.data.success){
                    this.getCar();
                }else{
                    alert("數量更新錯誤");
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //刪除單一購物車
        deleteCar(id){
            this.loadingStatu = id;
            axios.delete(`${url}api/${path}/cart/${id}`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    this.loadingStatu = "";
                    alert(res.data.message);
                    this.getCar();
                }else{
                    alert("刪除失敗");
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //刪除全部
        deleteAllCar(){
            axios.delete(`${url}api/${path}/carts`)
            .then((res) => {
                // console.log(res);
                if(res.data.success){
                    alert("購物車已全刪除");
                    this.getCar();
                }else{
                    alert("刪除失敗");
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //電話rules
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },

        //送出表單
        createdOrder(){
            // console.dir(this.$refs)
            if(this.shoppingCar.length === 0){
                alert("購物車沒有商品");
            }else{
                const order = this.form;
                axios.post(`${url}api/${path}/order`,{data:order})
                .then((res) => {
                    console.log(res);
                    if(res.data.success){
                        alert(res.data.message);
                        this.$refs.form.resetForm();
                        this.getCar();
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            }

        }
    },

    created(){
        this.getProductsData();
        this.getCar();
    }

})

app.component('productDetail',productDetail);

// VeeValidate套件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');
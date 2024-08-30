export const Base_url='http://localhost:3000'
import axios from 'axios'

class  ApiServices {
    // pending
    getToken(){
        return {
            'Authorization':sessionStorage.getItem('token'),
            'UserId':sessionStorage.getItem('userId'),
            'content-type': 'application/x-www-form-urlencoded'
        }
    }
    // auth
    login(data){
        return axios.post(`${Base_url}/server/login`,data)
    }
    register(data){
        return axios.post(`${Base_url}/server/register`,data)
    }

    // auctions
    createAuction(data){
        return axios.post(`${Base_url}/server/auction/create`,data,{
            headers:this.getToken()
        })
    }
    getAuction(data){
        return axios.post(`${Base_url}/server/auction/get`,data,{
            headers:this.getToken()
        })
    }
    bidGetAuction(data){
        return axios.post(`${Base_url}/server/auction/bidget`,data,{
            headers:this.getToken()
        })
    }

    participateAuction(data){
        return axios.post(`${Base_url}/server/auction/participated_auc`,data,{
            headers:this.getToken()
        })
    }
    getPartAuction(data){
        return axios.post(`${Base_url}/server/auction/get_participated_auc`,data,{
            headers:this.getToken()
        })
    }

    updateAuctions(data){
        return axios.post(`${Base_url}/server/auction/update`,data,{
            headers:this.getToken()
        })
    }
    deleteAuction(data){
        return axios.post(`${Base_url}/server/auction/delete`,data,{
            headers:this.getToken()
        })
    }
    adminDelAuction(data){
        return axios.post(`${Base_url}/server/auction/admindel`,data,{
            headers:this.getToken()
        })
    }


    // bidding
    addBid(data){
        return axios.post(`${Base_url}/server/log/add`,data,{
            headers:this.getToken()
        })
    }
    getBid(data){
        return axios.post(`${Base_url}/server/log/read`,data,{
            headers:this.getToken()
        })
    }
}

export default new ApiServices;
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { base_url } from './config'

function Home() {

    const [total_price, set_total_price] = useState(0)
    const [orders, set_orders] = useState([])

    const [items, set_items] = useState([])

    const [state, setState] = useState({
        name: "",
        quantity: '',
        price: ""
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const [shipping_info, set_shipping_info] = useState({
        name: '',
        email: '',
        district: '',
        sub_district: '',
        address: '',
        payment_method: ''
    })

    const info_handle = (e) => {
        set_shipping_info({
            ...shipping_info,
            [e.target.name]: e.target.value
        })
    }

    const added = (e) => {

        e.preventDefault()
        const price = state.quantity * state.price
        set_items([...items, { ...state, quantity: parseInt(state.quantity), price: parseInt(state.price) }])
        set_total_price(parseInt(total_price + price))
        setState({
            name: "",
            quantity: '',
            price: ""
        })

    }

    const navigate = useNavigate()
    const [loader, set_loader] = useState(false)
    const order = async (e) => {
        e.preventDefault()
        try {
            set_loader(true)
            const { data } = await axios.post(`${base_url}/api/order`, { items, total_price: total_price, shipping_info })
            set_loader(false)
            toast.success(data.message)
            set_total_price(0)
            set_items([])
            set_orders([...orders, data.order])
            set_shipping_info({
                name: '',
                email: '',
                district: '',
                sub_district: '',
                address: '',
                payment_method: ''
            })
            navigate(`/invoice/${data.order?._id}`)
        } catch (error) {
            set_loader(false)
            toast.error(error.response.data.message)
        }
    }

    const get_orders = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/orders`)
            set_orders(data.orders)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        get_orders()
    }, [])
    return (
        <div>
            <h2 className='pb-3 text-3xl font-semibold  text-center pt-10'>Pdf Generate Node/ExpressJs React</h2>
            <Toaster />
            <div className='flex flex-col md:flex-row md:gap-x-[5%] gap-y-10 p-10'>

                <form onSubmit={added} className='md:w-[30%] w-full shadow p-5'>
                    <h2 className='pb-3 text-xl font-semibold '>Item Add</h2>
                    <div className='flex gap-y-2 flex-col mb-3'>
                        <label htmlFor="name">Item Name</label>
                        <input onChange={inputHandle} value={state.name} type="text" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='item name' id='name' name='name' required />
                    </div>
                    <div className='flex gap-y-2 flex-col mb-3'>
                        <label htmlFor="quantity">Quantity</label>
                        <input onChange={inputHandle} value={state.quantity} type="number" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='quantity' id='quantity' name='quantity' required />
                    </div>
                    <div className='flex gap-y-2 flex-col mb-5'>
                        <label htmlFor="price">Price</label>
                        <input onChange={inputHandle} value={state.price} type="number" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='price' id='price' name='price' required />
                    </div>
                    <button className='px-3 py-2 bg-purple-500 hover:bg-purple-600 outline rounded-md text-white w-full'>Submit</button>
                </form>
                <div className='w-[100%] md:w-[65%]  p-5 shadow'>
                    <h2 className='pb-3 text-xl font-semibold '>Items</h2>
                    <div className="relative overflow-x-auto w-full">
                        <table className="w-full text-sm text-left rtl:text-right ">
                            <thead className="text-xs  uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Item name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    items.map((item, i) => <tr key={i} className="bg-white border-b ">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {i + 1}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {item.name}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {item.quantity}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            ${item.price}
                                        </th>

                                    </tr>)
                                }
                                {
                                    items.length > 0 && <tr className="bg-white ">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">

                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">

                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-2xl">
                                            total
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-xl">
                                            ${total_price}
                                        </th>

                                    </tr>
                                }

                            </tbody>
                        </table>
                    </div>
                    {
                        items.length > 0 && <form onSubmit={order}>

                            <h2 className='pb-3 text-xl font-semibold '>Shipping Informaion</h2>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 '>
                                <div className='flex gap-y-2 flex-col mb-3'>
                                    <label htmlFor="customer_name">Name</label>
                                    <input onChange={info_handle} value={shipping_info.name} type="text" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='item name' id='customer_name' name='name' required />
                                </div>
                                <div className='flex gap-y-2 flex-col mb-3'>
                                    <label htmlFor="email">Email</label>
                                    <input onChange={info_handle} value={shipping_info.email} type="email" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='email' id='email' name='email' required />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5'>
                                <div className='flex gap-y-2 flex-col mb-3'>
                                    <label htmlFor="district">District</label>
                                    <input onChange={info_handle} value={shipping_info.district} type="text" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='district' id='district' name='district' required />
                                </div>
                                <div className='flex gap-y-2 flex-col mb-3'>
                                    <label htmlFor="sub_district">Sub District</label>
                                    <input onChange={info_handle} value={shipping_info.sub_district} type="text" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='sub district' id='sub_district' name='sub_district' required />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5'>
                                <div className='flex gap-y-2 flex-col mb-3'>
                                    <label htmlFor="address">Address</label>
                                    <input onChange={info_handle} value={shipping_info.address} type="text" className='px-3 py-2 outline-none border border-slate-500 rounded-md' placeholder='address' id='address' name='address' required />
                                </div>
                                <div className='flex gap-y-2 flex-col mb-3'>
                                    <label htmlFor="payment_method">Payment method</label>
                                    <select onChange={info_handle} value={shipping_info.payment_method} className='px-3 py-2 outline-none border border-slate-500 rounded-md' id='payment_method' name='payment_method' required>
                                        <option value="">--select--</option>
                                        <option value="Bkash">Bkash</option>
                                        <option value="Roket">Roket</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button disabled={loader} className='px-6 py-2 bg-purple-500 hover:bg-purple-600 outline rounded-md text-white'>{loader ? 'Loading' : 'Submit'}</button>
                            </div>
                        </form>

                    }
                </div>
            </div>

            <div className='p-10'>
                <div className="relative overflow-x-auto w-full">
                    <table className="w-full text-sm text-left rtl:text-right shadow-md">
                        <thead className="text-xs  uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Order Id
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Order Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                orders.length > 0 && orders.map((order, i) => <tr key={i} className="bg-white border-b ">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {i + 1}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {Math.random().toString(36).substring(2, 9).toLocaleUpperCase()}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {order.shipping_info?.address}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        ${order.total_price}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {moment(order.createdAt).format('LLL')}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <Link to={`/invoice/${order._id}`}>View</Link>
                                    </th>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home

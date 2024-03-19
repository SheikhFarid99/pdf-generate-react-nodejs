import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { saveAs } from 'file-saver'
import {base_url} from './config'

const Invoice = () => {

    const [order, set_order] = useState({})

    const { order_id } = useParams()

    const get_order = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/order/${order_id}`)
            set_order(data.order)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (order_id) {
            get_order()
        }

    }, [order_id])

    const invoice_download = async () => {
        try {
            const { data } = await axios.get(`${base_url}/api/invoice/download/${order_id}`, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'arraybuffer'
            })
            const blob = new Blob([data], { type: 'application/pdf' })
            saveAs(blob, `${order_id}.pdf`)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='py-10 min-h-screen bg-slate-200 flex justify-center items-center flex-col'>
            <div className='w-[55%] p-6 h-auto bg-white shadow-md hidden md:block'>
                <div className='flex justify-between'>
                    <div className='flex flex-col justify-center items-center gap-y-2'>
                        <img className='w-[130px] h-[90px]' src={`${base_url}/files/logo.png`} alt="" />
                        <h2 className='text-xl font-semibold text-blue-500'>Learn with Project</h2>
                    </div>
                    <div className='flex justify-end flex-col gap-y-5'>
                        <h2 className='text-3xl text-end font-semibold text-blue-500 uppercase'>INvoice</h2>
                        <div className='grid grid-cols-2 gap-x-10'>
                            <div className='flex justify-end flex-col'>
                                <h1 className='text-md font-semibold text-end'>Invoice No:</h1>
                                <h1 className='text-md font-semibold text-end'>Invoice Date:</h1>
                                <h1 className='text-md font-semibold text-end'>Purchase Order:</h1>
                            </div>
                            <div className='flex justify-end flex-col'>
                                <span className='text-end'>{Math.random().toString(36).substring(2, 9).toLocaleUpperCase()}</span>
                                <span className='text-end'>{moment(order.createdAt).format('LL')}</span>
                                <span className='text-end'>{Math.random().toString(36).substring(2, 9).toLocaleUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-5'>
                    <div className='mt-8'>
                        <div className='flex justify-start flex-col gap-y-1'>
                            <h2 className='text-xl font-semibold'>{order.shipping_info?.name}</h2>
                            <span>District: {order.shipping_info?.district}</span>
                            <span>Sub District: {order.shipping_info?.sub_district}</span>
                            <span>Address: {order.shipping_info?.address}</span>
                            <span>Email: {order.shipping_info?.email}</span>
                        </div>

                    </div>

                    <div className="relative overflow-x-auto w-full mt-14">
                        <table className="w-full text-sm text-left rtl:text-right ">
                            <thead className="text-xs  uppercase bg-blue-500 text-white">
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
                                    <th scope="col" className="px-6 py-3 text-end">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    order.order_items?.map((item, i) => <tr key={i} className={`${i % 2 === 1 ? 'bg-white' : 'bg-slate-100'}`}>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {i + 1}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {item.name}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {item.quantity}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-end">
                                            ${item.price}
                                        </th>

                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='flex justify-end mt-8'>
                        <div className='border-t flex gap-x-4 px-6 py-4 border-slate-300'>
                            <h2 className='text-lg font-semibold whitespace-nowrap'>Total amount: </h2>
                            <h2 className='text-lg font-semibold'>${order.total_price}</h2>
                        </div>
                    </div>

                </div>
                <div className='flex justify-end flex-col px-6 pt-4 gap-y-1 text-blue-500 mt-5'>
                    <span>Huawei Authorized Experience Shop-Top Enterprise</span>
                    <span>Hospital Road, Pabna 6600</span>
                    <span>01944-888674 , sheikhfarid@gmail.com</span>
                </div>
            </div>

            <div className='p-4 flex gap-x-2'>
                <button onClick={invoice_download} className='px-6 py-2 bg-purple-500 hover:bg-purple-600 outline rounded-md text-white'>Download</button>
                <Link to='/' className='px-6 py-2 bg-blue-500 hover:bg-blue-600 outline rounded-md text-white'>Back</Link>
            </div>
        </div>
    )
}

export default Invoice